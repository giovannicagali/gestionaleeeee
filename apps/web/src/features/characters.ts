import Dexie, { type EntityTable } from 'dexie';
import { cleanSheet, type CharacterSheet, validateCharacter, speciesOptions, classOptions, alignments } from '@dnd/shared';
export { cleanSheet, validateCharacter, speciesOptions, classOptions, alignments };
export type { CharacterSheet };

export type CharacterStatus = 'active' | 'archived' | 'trashed';
export interface CharacterRecord {
  id: string; owner_id: string; name: string; status: CharacterStatus; revision: number;
  sheet: CharacterSheet; created_at: string; updated_at: string; trashed_at: string | null;
}
export interface CharacterRevision {
  id: number; revision: number; event: string;
  old_snapshot: { name: string; status: CharacterStatus; sheet: CharacterSheet } | null;
  new_snapshot: { name: string; status: CharacterStatus; sheet: CharacterSheet };
  created_at: string;
}
interface RevisionRow extends CharacterRevision { character_id: string; }
class CharacterDb extends Dexie {
  characters!: EntityTable<CharacterRecord, 'id'>;
  revisions!: EntityTable<RevisionRow, 'id'>;
  constructor() {
    super('dnd_character_archive_v1');
    this.version(1).stores({ characters: '&id, status, updated_at, name', revisions: '++id, character_id, revision, created_at' });
  }
}
const db = new CharacterDb();
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();
function snapshot(c: CharacterRecord) { return { name:c.name, status:c.status, sheet:c.sheet }; }
async function revise(old: CharacterRecord | null, next: CharacterRecord, event: string) {
  await db.transaction('rw', db.characters, db.revisions, async () => {
    await db.characters.put(next);
    await db.revisions.add({ character_id: next.id, revision: next.revision, event,
      old_snapshot: old ? snapshot(old) : null, new_snapshot: snapshot(next), created_at: now() });
  });
}
export async function fetchCharacters(): Promise<CharacterRecord[]> {
  return (await db.characters.toArray()).sort((a,b)=>b.updated_at.localeCompare(a.updated_at));
}
export async function createCharacter(name: string, sheet: CharacterSheet): Promise<CharacterRecord> {
  const error = validateCharacter(name, sheet); if (error) throw new Error(error);
  const stamp=now();
  const record: CharacterRecord = { id:id(), owner_id:'local', name:name.trim(), status:'archived', revision:1,
    sheet:cleanSheet(sheet), created_at:stamp, updated_at:stamp, trashed_at:null };
  await revise(null,record,'created'); return record;
}
export async function saveCharacter(char: CharacterRecord, name: string, sheet: CharacterSheet): Promise<CharacterRecord> {
  const error=validateCharacter(name,sheet); if(error) throw new Error(error);
  const old=await db.characters.get(char.id); if(!old) throw new Error('Personaggio non trovato.');
  const next={...old,name:name.trim(),sheet:cleanSheet(sheet),revision:old.revision+1,updated_at:now()};
  await revise(old,next,'updated'); return next;
}
export async function activateCharacter(char: CharacterRecord): Promise<CharacterRecord> {
  const all=await db.characters.toArray(); const target=all.find(c=>c.id===char.id);
  if(!target) throw new Error('Personaggio non trovato.');
  await db.transaction('rw',db.characters,db.revisions,async()=>{
    for(const c of all.filter(x=>x.status==='active'&&x.id!==char.id)){
      const next={...c,status:'archived' as const,revision:c.revision+1,updated_at:now()};
      await db.characters.put(next); await db.revisions.add({character_id:c.id,revision:next.revision,event:'deactivated',old_snapshot:snapshot(c),new_snapshot:snapshot(next),created_at:now()});
    }
    const next={...target,status:'active' as const,revision:target.revision+1,updated_at:now()};
    await db.characters.put(next); await db.revisions.add({character_id:target.id,revision:next.revision,event:'activated',old_snapshot:snapshot(target),new_snapshot:snapshot(next),created_at:now()});
  });
  return (await db.characters.get(char.id))!;
}
export async function changeCharacterStatus(char: CharacterRecord, status: 'archived'|'trashed'): Promise<CharacterRecord> {
  const old=await db.characters.get(char.id); if(!old) throw new Error('Personaggio non trovato.');
  const next={...old,status,revision:old.revision+1,updated_at:now(),trashed_at:status==='trashed'?now():null};
  await revise(old,next,status); return next;
}
export async function restoreCharacter(char: CharacterRecord): Promise<CharacterRecord> {
  const old=await db.characters.get(char.id); if(!old) throw new Error('Personaggio non trovato.');
  if(old.trashed_at && Date.now()-Date.parse(old.trashed_at)>30*86400000) throw new Error('Il periodo di ripristino di 30 giorni è scaduto.');
  const next={...old,status:'archived' as const,revision:old.revision+1,updated_at:now(),trashed_at:null};
  await revise(old,next,'restored'); return next;
}
export async function fetchRevisions(charId: string): Promise<CharacterRevision[]> {
  return (await db.revisions.where('character_id').equals(charId).reverse().sortBy('revision')).slice(0,100);
}
export async function exportCharacters(): Promise<string> {
  return JSON.stringify({ format:'dnd-character-archive', version:1, exportedAt:now(), characters:await db.characters.toArray() },null,2);
}
export async function importCharacters(json: string): Promise<number> {
  const data=JSON.parse(json);
  if(data?.format!=='dnd-character-archive'||data?.version!==1||!Array.isArray(data.characters)) throw new Error('File di backup non valido.');
  const records: CharacterRecord[] = data.characters.map((c: CharacterRecord)=>{
    if(!c || typeof c.id!=='string'||typeof c.name!=='string'||!c.sheet||!['active','archived','trashed'].includes(c.status)) throw new Error('Il backup contiene un personaggio non valido.');
    const error=validateCharacter(c.name,c.sheet); if(error) throw new Error(error);
    return {...c,owner_id:'local',sheet:cleanSheet(c.sheet)};
  });
  await db.transaction('rw',db.characters,async()=>{ for(const c of records) await db.characters.put(c); });
  return records.length;
}
