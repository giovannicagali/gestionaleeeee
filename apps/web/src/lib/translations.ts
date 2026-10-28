import type { Locale } from '@dnd/shared';
export const translations = {
 it: {
  foundation: 'Fase 1 · Fondamenta', subtitle:'Il tuo archivio degli eroi, in costruzione.',
  tagline:'Ogni leggenda comincia da una scheda.', description:'Uno spazio personale per dare vita ai tuoi personaggi. Stiamo costruendo le fondamenta di una dimora sicura, accessibile e pronta per le tue avventure.',
  overview:'Panoramica', battle:'Combattimento', spells:'Incantesimi', inventory:'Inventario', features:'Caratteristiche', story:'Storia',
  status:'Stato del progetto', milestone:'Primo traguardo', milestoneTitle:'Le fondamenta sono pronte', milestoneText:'Interfaccia, PWA e struttura del progetto. La creazione e il salvataggio dei personaggi arriveranno nelle fasi successive.',
  next:'Prossima fase', nextTitle:'Account e personaggi', nextText:'Inviti, accesso privato e prima scheda modificabile.',
  architecture:'Architettura', connected:'Configurazione Supabase rilevata', unconfigured:'Supabase da configurare',
  online:'In linea', offline:'Senza connessione', local:'Archiviazione locale predisposta',
  current:'In questa fase', pending:'Pianificato', update:'Aggiornamento disponibile', install:'Aggiorna quando sei pronto', later:'Più tardi',
  language:'Lingua', theme:'Tema', themeToggle:'Cambia tema', sectionPlanned:'Questa sezione verrà implementata nelle fasi successive.',
  noData:'Nessun personaggio viene creato o salvato in questa anteprima.',
  foundationNote:'Anteprima tecnica — nessuna autenticazione o sincronizzazione reale è ancora attiva.',
  collection:'La tua compagnia', collectionText:'L’avventura prenderà forma qui.',
  feature1:'Accesso solo su invito', feature2:'Schede accessibili offline', feature3:'Cronologia e backup',
  about:'D&D 5e · Regole 2014', placeholder:'In preparazione'
 },
 en: {
  foundation:'Phase 1 · Foundations', subtitle:'Your heroes’ archive, under construction.',
  tagline:'Every legend begins with a character sheet.', description:'A private place for your characters to come alive. We are building the foundations for a secure, accessible home for your adventures.',
  overview:'Overview', battle:'Combat', spells:'Spells', inventory:'Inventory', features:'Features', story:'Story',
  status:'Project status', milestone:'First milestone', milestoneTitle:'Foundations are ready', milestoneText:'Interface, PWA and project structure. Character creation and saving will follow in later phases.',
  next:'Next phase', nextTitle:'Accounts and characters', nextText:'Invites, private sign-in and the first editable character sheet.',
  architecture:'Architecture', connected:'Supabase configuration detected', unconfigured:'Supabase requires configuration',
  online:'Online', offline:'Offline', local:'Local storage prepared',
  current:'In this phase', pending:'Planned', update:'Update available', install:'Update when ready', later:'Later',
  language:'Language', theme:'Theme', themeToggle:'Toggle theme', sectionPlanned:'This section will be implemented in future phases.',
  noData:'No characters are created or saved in this preview.',
  foundationNote:'Technical preview — real authentication and synchronization are not active yet.',
  collection:'Your party', collectionText:'Your adventure will begin here.',
  feature1:'Invite-only access', feature2:'Offline character sheets', feature3:'History and backups',
  about:'D&D 5e · 2014 rules', placeholder:'Coming soon'
 }
} as const;
export type Translation = typeof translations[Locale];
