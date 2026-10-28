import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Archive, ArrowLeft, BookOpen, CheckCircle2, ChevronRight, CirclePlus, Clock3, Compass, FileClock, Pencil, RotateCcw, ScrollText, Search, Shield, Sparkles, Swords, Trash2, WandSparkles, Backpack, RefreshCw } from 'lucide-react';
import { catalogLabel, type Locale } from '@dnd/shared';
import { translations } from '../lib/translations';
import { activateCharacter, alignments, changeCharacterStatus, classOptions, cleanSheet, createCharacter, fetchCharacters, fetchRevisions, restoreCharacter, saveCharacter, speciesOptions, validateCharacter, type CharacterRecord, type CharacterRevision, type CharacterSheet } from './characters';

const tabs = [
  { id:'overview', key:'overview', icon:Compass },{ id:'battle', key:'battle', icon:Swords },
  { id:'spells', key:'spells', icon:WandSparkles },{ id:'inventory', key:'inventory', icon:Backpack },
  { id:'features', key:'features', icon:Shield },{ id:'story', key:'story', icon:ScrollText }
] as const;
type Tab = (typeof tabs)[number]['id'];
const emptySheet: CharacterSheet = {};
const localeDate = (iso: string, it: boolean) => new Intl.DateTimeFormat(it?'it-IT':'en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date(iso));

function CharacterEditor({ record, creating, locale, onDone, onDirtyChange, onClose } : {
  record: CharacterRecord | null; creating: boolean; locale: Locale;
  onDone: (record: CharacterRecord) => void;
  onDirtyChange: (dirty:boolean)=>void; onClose:()=>void;
}) {
  const it=locale==='it';
  const [name,setName] = useState(record?.name || '');
  const [sheet,setSheet] = useState<CharacterSheet>(record?.sheet || emptySheet);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [tab,setTab]=useState<Tab>('overview');
  const [history,setHistory] = useState<CharacterRevision[] | null>(null);
  const [showHistory,setShowHistory] = useState(false);
  const [editing,setEditing] = useState(creating);
  const [dirty,setDirty] = useState(false);
  useEffect(()=>{
    setName(record?.name || '');setSheet(record?.sheet || {});
    setDirty(false);onDirtyChange(false);setError('');setTab('overview');setHistory(null);
    setEditing(creating);
  }, [record?.id, record?.revision, creating, onDirtyChange]);
  function updateField<K extends keyof CharacterSheet>(key: K, value: CharacterSheet[K]) {
    setSheet(prev => ({...prev,[key]:value}));setDirty(true);onDirtyChange(true);
  }
  function updateName(value:string) {setName(value);setDirty(true);onDirtyChange(true);}
  async function save(ev:FormEvent) {
    ev.preventDefault();setError('');
    const checked=validateCharacter(name,sheet);
    if (checked){setError(checked);return;}
    setBusy(true);
    try {
      const data=creating?await createCharacter(name,cleanSheet(sheet)):await saveCharacter(record!,name,cleanSheet(sheet));
      onDirtyChange(false);setDirty(false);setEditing(false);onDone(data);
    } catch (e) {setError(e instanceof Error?e.message:String(e));}
    finally {setBusy(false);}
  }
  function cancelEdit() {
    if (dirty && !window.confirm(it?'Scartare le modifiche non salvate?':'Discard unsaved changes?')) return;
    onDirtyChange(false);setDirty(false);
    if (creating) onClose(); else {setName(record?.name || '');setSheet(record?.sheet || {});setEditing(false);}
  }
  async function loadHistory(){if(!record)return;try{setHistory(await fetchRevisions(record.id));setShowHistory(true);setError('');}catch(e){setError(e instanceof Error?e.message:String(e));}}
  const subclasses=speciesOptions[sheet.species || ''] || [];
  const inForm=creating || editing;
  return <div className="character-open">
    <div className="character-header"><button className="subtle-button" onClick={onClose}><ArrowLeft size={17}/>{it?'Tutti i personaggi':'All characters'}</button>
      <span className={'state-pill '+(record?.status==='active'?'state-active':'')}>{creating?(it?'Nuovo personaggio':'New character'):record?.status==='active'?(it?'Personaggio attivo':'Active character'):record?.status==='trashed'?(it?'Nel cestino':'In trash'):(it?'Archiviato':'Archived')}</span>
    </div>
    <div className="character-heading"><div><p className="mini-label">{creating?'NEW ADVENTURER':`REVISION ${record?.revision || 1}`}</p><h1>{name || (it?'Senza nome':'Unnamed')}</h1><p>{[sheet.species?catalogLabel('species',sheet.species,locale):null,sheet.className?catalogLabel('class',sheet.className,locale):null,sheet.level?`${it?'Livello':'Level'} ${sheet.level}`:null].filter(Boolean).join(' · ') || (it?'Scheda iniziale':'Starter sheet')}</p></div>
      {!creating && !editing && record?.status!=='trashed' && <button className="secondary-button" onClick={()=>setEditing(true)}><Pencil size={16}/>{it?'Modifica scheda':'Edit sheet'}</button>}
    </div>
    <nav className="character-tabs" aria-label={it?'Scheda personaggio':'Character sheet'}>{tabs.map(({id,key,icon:Icon})=><button key={id} type="button" aria-current={tab===id?'page':undefined} onClick={()=>setTab(id)} className={tab===id?'selected':''}><Icon size={16}/>{translations[locale][key]}</button>)}</nav>
    {error && <div className="error-message" role="alert">{error}{error.includes('conflict') && <p>{it?'Un altro dispositivo potrebbe aver modificato questo personaggio. Torna all’elenco e ricarica prima di riprovare.':'Another device may have modified this character. Return to the list and refresh before retrying.'}</p>}</div>}
    <div className="paper-panel character-form-panel">
      {tab!=='overview' && tab!=='story' && <div className="future-notice"><Sparkles size={20}/><div><strong>{it?'Modulo previsto nella prossima fase':'Module planned for the next phase'}</strong><p>{it?'In Fase 2 sono modificabili i dati iniziali del personaggio. I calcoli completi D&D arriveranno nella Fase 3.':'Phase 2 supports basic character data. Full D&D calculations arrive in Phase 3.'}</p></div></div>}
      {(tab==='overview'||tab==='story') && <form onSubmit={ev=>{void save(ev);}} className="form-stack">
        {tab==='overview' ? <>
          <div className="form-intro"><h2>{it?'Identità dell’eroe':'Hero identity'}</h2><p>{it?'Solo il nome è obbligatorio. I campi facoltativi possono essere completati in seguito.':'Only the name is required. Optional fields can be completed later.'}</p></div>
          <div className="edit-grid">
            <label>{it?'Nome *':'Name *'}<input required disabled={!inForm} value={name} onChange={e=>updateName(e.target.value)} maxLength={120}/></label>
            <label>{it?'Livello':'Level'}<input type="number" disabled={!inForm} value={sheet.level ?? ''} min={1} max={20} onChange={e=>updateField('level',e.target.value?Number(e.target.value):undefined)} placeholder="1"/></label>
            <label>{it?'Specie':'Species'}<select disabled={!inForm} value={sheet.species||''} onChange={e=>{setSheet(prev=>{const next={...prev};if(e.target.value)next.species=e.target.value;else delete next.species;delete next.subrace;return next;});setDirty(true);onDirtyChange(true);}}>
              <option value="">{it?'Da scegliere':'Not selected'}</option>{Object.keys(speciesOptions).map(s=><option key={s} value={s}>{catalogLabel('species',s,locale)}</option>)}</select></label>
            <label>{it?'Sottospecie':'Subspecies'} {subclasses.length>0?'*':''}<select disabled={!inForm || !sheet.species || subclasses.length===0} required={subclasses.length>0} value={sheet.subrace||''} onChange={e=>updateField('subrace',e.target.value||undefined)}><option value="">{subclasses.length===0?(it?'Non prevista':'Not applicable'):(it?'Seleziona':'Select')}</option>{subclasses.map(x=><option key={x} value={x}>{catalogLabel('subrace',x,locale)}</option>)}</select></label>
            <label>{it?'Classe':'Class'}<select disabled={!inForm} value={sheet.className||''} onChange={e=>updateField('className',e.target.value||undefined)}><option value="">{it?'Da scegliere':'Not selected'}</option>{classOptions.map(c=><option key={c} value={c}>{catalogLabel('class',c,locale)}</option>)}</select></label>
            <label>{it?'Background':'Background'}<input disabled={!inForm} value={sheet.background||''} maxLength={200} onChange={e=>updateField('background',e.target.value)}/></label>
            <label>{it?'Allineamento':'Alignment'}<select disabled={!inForm} value={sheet.alignment||''} onChange={e=>updateField('alignment',e.target.value)}><option value="">{it?'Da scegliere':'Not selected'}</option>{alignments.map(a=><option key={a} value={a}>{catalogLabel('alignment',a,locale)}</option>)}</select></label>
          </div>
          <div className="quiet">{it?'Valori automatici, multiclasse, competenze e catalogo guidato arriveranno nelle fasi successive. Nessun tiro di dado digitale.':'Automated values, multiclassing, proficiencies and guided catalog are planned for upcoming phases. No digital dice roller.'}</div>
        </> : <><div className="form-intro"><h2>{it?'Storia del personaggio':'Character backstory'}</h2><p>{it?'La storia è facoltativa e resta privata.':'The backstory is optional and stays private.'}</p></div><label>{it?'Storia':'Backstory'}<textarea rows={9} disabled={!inForm} value={sheet.backstory||''} maxLength={15000} onChange={e=>updateField('backstory',e.target.value)} /></label></>}
        {inForm && <div className="form-actions"><button type="submit" disabled={busy} className="primary-button"><CheckCircle2 size={17}/>{busy?(it?'Salvataggio…':'Saving…'):creating?(it?'Crea personaggio':'Create character'):(it?'Salva modifiche':'Save changes')}</button><button type="button" className="secondary-button" onClick={cancelEdit}>{it?'Annulla':'Cancel'}</button>{dirty && <small>{it?'Modifiche non salvate':'Unsaved changes'}</small>}</div>}
      </form>}
    </div>
    {!creating && record && <section className="history-preview paper-panel"><div className="section-title"><div><p className="mini-label">HISTORY</p><h2>{it?'Revisioni della scheda':'Sheet revisions'}</h2></div><button className="secondary-button" onClick={()=>{if(showHistory)setShowHistory(false);else void loadHistory();}}><FileClock size={16}/>{showHistory?(it?'Nascondi':'Hide'):(it?'Mostra revisioni':'Show revisions')}</button></div>
      {showHistory && <div className="stacked-rows">{history?.length ? history.map(rev=><div key={rev.id} className="revision-row"><div><strong>#{rev.revision} · {rev.event}</strong><p>{localeDate(rev.created_at,it)}</p></div><details><summary>{it?'Dettagli':'Details'}</summary><pre>{JSON.stringify({before:rev.old_snapshot,after:rev.new_snapshot},null,2)}</pre></details></div>):<p className="quiet">{it?'Nessuna revisione recuperata.':'No revisions found.'}</p>}</div>}
      <p className="quiet">{it?'Questa è una prima consultazione delle revisioni. Confronto avanzato e ripristino guidato arriveranno nelle fasi successive.':'This is an initial revision viewer. Advanced comparison and guided rollback will follow.'}</p>
    </section>}
  </div>;
}

export function CharacterManager({ locale, onUnsavedChange }: {locale:Locale; onUnsavedChange?: (value: boolean) => void}) {
  const it=locale==='it';
  const [characters,setCharacters]=useState<CharacterRecord[]>([]);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [creating,setCreating]=useState(false);
  const [dirty,setDirty]=useState(false);
  const [search,setSearch]=useState('');
  const [speciesFilter,setSpeciesFilter]=useState('');
  const [classFilter,setClassFilter]=useState('');
  const [levelFilter,setLevelFilter]=useState('');
  const [trashView,setTrashView]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const markDirty=useCallback((value:boolean)=>{setDirty(value);onUnsavedChange?.(value);},[onUnsavedChange]);
  const load=useCallback(async()=>{
    setLoading(true);
    try { setCharacters(await fetchCharacters());setError(''); }
    catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{void load();},[load]);
  useEffect(()=>{
    function onBeforeUnload(e:BeforeUnloadEvent) { if(dirty) {e.preventDefault();e.returnValue='';} }
    window.addEventListener('beforeunload',onBeforeUnload);
    return ()=>window.removeEventListener('beforeunload',onBeforeUnload);
  },[dirty]);
  const selected=characters.find(x=>x.id===selectedId) || null;
  const filtered=useMemo(()=>characters.filter(x=> (trashView?x.status==='trashed':x.status!=='trashed') &&
    x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
    (!speciesFilter||x.sheet?.species===speciesFilter) && (!classFilter||x.sheet?.className===classFilter) &&
    (!levelFilter||String(x.sheet?.level??'')===levelFilter)),[characters,search,speciesFilter,classFilter,levelFilter,trashView]);
  function canSwitch(){return !dirty || window.confirm(it?'Hai modifiche non salvate: vuoi scartarle?':'You have unsaved changes. Discard them?');}
  function open(id:string){if(!canSwitch())return;markDirty(false);setCreating(false);setSelectedId(id);}
  function close(){if(!canSwitch())return;markDirty(false);setCreating(false);setSelectedId(null);}
  async function changeStatus(char:CharacterRecord,action:'activate'|'archive'|'trash'|'restore'){
    if (!canSwitch()) return;
    if(action==='trash' && !window.confirm(it?`Spostare "${char.name}" nel cestino per 30 giorni?`:`Move "${char.name}" to trash for 30 days?`))return;
    setBusy(true);setNotice('');setError('');
    try {
      if(action==='activate')await activateCharacter(char);
      else if(action==='restore')await restoreCharacter(char);
      else await changeCharacterStatus(char,action==='archive'?'archived':'trashed');
      if(selectedId===char.id && action==='trash')setSelectedId(null);
      await load();setNotice(it?'Personaggio aggiornato.':'Character updated.');
    }catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setBusy(false);}
  }
  if (creating || selected) return <CharacterEditor record={selected} creating={creating} locale={locale}
    onDirtyChange={markDirty} onClose={close} onDone={record=>{markDirty(false);setCreating(false);setSelectedId(record.id);void load();}}/>;
  const active=characters.find(c=>c.status==='active');
  return <section className="content-page">
    <div className="section-title"><div><p className="mini-label">YOUR CHRONICLES / 02</p><h2>{it?'La tua compagnia':'Your party'}</h2></div>
      <button className="primary-button" disabled={busy} onClick={()=>{setCreating(true);setSelectedId(null);}}><CirclePlus size={17}/>{it?'Nuovo personaggio':'New character'}</button></div>
    <p className="section-lead">{it?'Le schede sono private e collegate al tuo account. Solo un personaggio può essere attivo alla volta.':'Characters are private to your account. Only one character can be active at a time.'}</p>
    {error && <div className="error-message" role="alert">{error}</div>}
    {notice && <div className="success-message" role="status">{notice}</div>}
    <div className="active-strip"><span><Compass size={16}/>{it?'Personaggio attivo':'Active character'}</span><strong>{active?.name||(it?'Nessuno':'None')}</strong><button className="subtle-button" disabled={loading} onClick={()=>void load()}><RefreshCw size={15}/>{it?'Aggiorna':'Refresh'}</button></div>
    <div className="filters"><label className="search-control"><Search size={17}/><input aria-label={it?'Cerca per nome':'Search by name'} placeholder={it?'Cerca per nome…':'Search by name…'} value={search} onChange={e=>setSearch(e.target.value)}/></label>
      <select aria-label={it?'Filtra per specie':'Filter species'} value={speciesFilter} onChange={e=>setSpeciesFilter(e.target.value)}><option value="">{it?'Tutte le specie':'All species'}</option>{[...new Set(characters.map(c=>c.sheet?.species).filter((x):x is string=>Boolean(x)))].sort((a,b)=>catalogLabel('species',a,locale).localeCompare(catalogLabel('species',b,locale),locale)).map(s=><option key={s} value={s}>{catalogLabel('species',s,locale)}</option>)}</select>
      <select aria-label={it?'Filtra per classe':'Filter class'} value={classFilter} onChange={e=>setClassFilter(e.target.value)}><option value="">{it?'Tutte le classi':'All classes'}</option>{[...new Set(characters.map(c=>c.sheet?.className).filter((x):x is string=>Boolean(x)))].sort((a,b)=>catalogLabel('class',a,locale).localeCompare(catalogLabel('class',b,locale),locale)).map(s=><option key={s} value={s}>{catalogLabel('class',s,locale)}</option>)}</select>
      <input className="level-filter" aria-label={it?'Filtra per livello':'Filter level'} type="number" min={1} max={20} placeholder={it?'Livello':'Level'} value={levelFilter} onChange={e=>setLevelFilter(e.target.value)}/>
      <button className={'tiny-button '+(trashView?'selected-toggle':'')} onClick={()=>setTrashView(v=>!v)}><Trash2 size={15}/>{trashView?(it?'Torna alle schede':'Back to characters'):(it?'Cestino':'Trash')}</button>
    </div>
    {loading?<div className="paper-panel empty-state">{it?'Caricamento personaggi…':'Loading characters…'}</div>:filtered.length===0?<div className="paper-panel empty-state"><BookOpen size={37}/><h3>{trashView?(it?'Cestino vuoto':'Trash is empty'):(it?'Nessun personaggio trovato':'No characters found')}</h3><p>{it?'Puoi creare un personaggio usando il pulsante in alto.':'You can create a character using the button above.'}</p></div>:
      <div className="character-grid">{filtered.map(char=><article className="character-card" key={char.id}>
        <div className="character-portrait" aria-hidden="true"><ScrollText size={36} strokeWidth={1.2}/></div>
        <div className="character-info"><div className="character-tags"><span className={'state-pill '+(char.status==='active'?'state-active':'')}>{char.status==='active'?(it?'Attivo':'Active'):char.status==='trashed'?(it?'Cestino':'Trash'):(it?'Archivio':'Archived')}</span><small>LV {char.sheet?.level||'—'}</small></div>
          <h3>{char.name}</h3><p>{[char.sheet?.species?catalogLabel('species',char.sheet.species,locale):null,char.sheet?.className?catalogLabel('class',char.sheet.className,locale):null].filter(Boolean).join(' · ') || (it?'Da completare':'Incomplete')}</p>
          <small>{it?'Aggiornato':'Updated'} {localeDate(char.updated_at,it)}</small>
        </div>
        <div className="character-card-actions">
          {char.status!=='trashed' && <button className="secondary-button" onClick={()=>open(char.id)}>{it?'Apri scheda':'Open sheet'}<ChevronRight size={15}/></button>}
          {char.status==='archived' && <button className="tiny-button" disabled={busy} onClick={()=>void changeStatus(char,'activate')}><CheckCircle2 size={14}/>{it?'Attiva':'Activate'}</button>}
          {char.status==='active' && <button className="tiny-button" disabled={busy} onClick={()=>void changeStatus(char,'archive')}><Archive size={14}/>{it?'Archivia':'Archive'}</button>}
          {char.status!=='trashed' && <button className="tiny-button danger-control" disabled={busy} onClick={()=>void changeStatus(char,'trash')}><Trash2 size={14}/>{it?'Cestino':'Trash'}</button>}
          {char.status==='trashed' && <button className="secondary-button" disabled={busy} onClick={()=>void changeStatus(char,'restore')}><RotateCcw size={15}/>{it?'Ripristina':'Restore'}</button>}
        </div>
      </article>)}</div>}
    <p className="quiet management-note"><Clock3 size={14}/>{it?'Il cestino mantiene gli elementi recuperabili per 30 giorni; la rimozione automatica definitiva non è ancora attiva. Nessun dato sensibile viene salvato offline in questa fase.':'Trash items are restorable for 30 days; automatic permanent deletion is not yet enabled. Sensitive data is not saved offline in this phase.'}</p>
  </section>;
}
