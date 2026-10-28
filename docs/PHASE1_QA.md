# Verifica consegna Fase 1 — 26 ottobre 2026

## Verificato nell'ambiente di generazione
- [x] 7 test automatici Node.js eseguiti e superati (2 shared, 3 rules-engine, 2 sync).
- [x] Compilazione TypeScript delle tre librerie principali tramite `tsc --noEmit --strict`.
- [x] Sintassi JSON valida per i package, tsconfig e manifest pertinenti.
- [x] Generati asset PWA PNG 192 e 512 e favicon SVG.
- [x] Migrazione PostgreSQL presente con RLS, policy di ownership e vincolo di un solo personaggio attivo.

## Da verificare sull'ambiente di sviluppo
- [ ] `npm install`: impossibile nel container di preparazione (registry npm non raggiungibile).
- [ ] `npm run build` e anteprima browser: richiedono dipendenze npm installate.
- [ ] Avvio reale Supabase con Docker, migrazione SQL e test RLS multiutente (Docker/Supabase non disponibili qui).
- [ ] Installazione PWA su dispositivi/browser reali.

La presenza dello schema e delle policy non è una verifica di sicurezza completata. Non usare dati di produzione finché test RLS, Auth e gestione inviti non sono implementati e superati.
