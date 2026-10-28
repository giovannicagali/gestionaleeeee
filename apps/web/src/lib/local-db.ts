import Dexie, { type EntityTable } from 'dexie';
/**
 * DATABASE DI FASE 1: SOLO preferenze e metadati non sensibili.
 * Non salvare personaggi, token o dati personali fino alla consegna
 * del progetto di cifratura e sblocco offline per singolo utente.
 */
interface LocalPreference { key: string; value: string; updatedAt: number; }
class FoundationDb extends Dexie {
  preferences!: EntityTable<LocalPreference, 'key'>;
  constructor() {
    super('dnd_foundation_v1');
    this.version(1).stores({ preferences: '&key, updatedAt' });
  }
}
export const localDb = new FoundationDb();
export async function storePreference(key: string, value: string): Promise<void> {
  if (!['theme', 'locale'].includes(key)) throw new Error('Preferenza non consentita');
  await localDb.preferences.put({ key, value, updatedAt: Date.now() });
}
export async function readPreference(key: string): Promise<string | undefined> {
  return (await localDb.preferences.get(key))?.value;
}
