# Fase 2 — Avvio Windows e attivazione account (locale)

Per la revisione 0.2.1, consulta anche `docs/PHASE2_REVIEW_2026-10-28.md`. Se il database è già avviato e hai già un account, NON eseguire reset o ricreazioni degli utenti.

La Fase 2 ha due livelli: **l'interfaccia React**, che parte subito, e **le funzioni account/personaggi**, che richiedono Supabase e una configurazione amministratore. Nessun accesso pubblico o signup automatico.

## 1. Estrarre il nuovo progetto

Lo ZIP della Fase 2 contiene il monorepo completo, non soltanto una patch.

1. Nel terminale precedente premi **Ctrl+C** per fermare Vite.
2. Estrai `dnd-character-manager-phase2.zip` in una **nuova cartella**, senza sovrascrivere il progetto precedente.
3. Apri la cartella `dnd-character-manager` contenuta nello ZIP e controlla `package.json`.
4. Nella barra degli indirizzi di Esplora file digita `cmd` e premi Invio.
5. Esegui:

   ```cmd
   npm install
   npm run dev
   ```

6. Apri l'indirizzo Vite, di norma <http://127.0.0.1:5173/>.

Per ora appare una pagina di configurazione se Supabase non è collegato. È normale. **Non inserire credenziali personali o schede reali prima di completare la configurazione di sicurezza.**

> Se hai già un `.env.local` nella vecchia cartella, puoi trasferirlo manualmente solo se contiene esclusivamente URL e chiave pubblica di Supabase. Non trasferire mai segreti del server nel frontend.

## 2. Preparare Supabase locale

Richiede Docker Desktop avviato (Linux containers), dipendenze npm installate e almeno diversi GB disponibili per i servizi locali.

Da una **seconda finestra** di `cmd`, nella radice del progetto:

```cmd
npm run supabase:start
npx supabase status
```

La prima esecuzione può scaricare immagini Docker e richiedere più tempo. La CLI applica le migration `supabase/migrations/*` su un database locale nuovo.

Leggi da `npx supabase status`:
- **API URL**, di solito `http://127.0.0.1:54321`;
- **anon key/publishable key**, pubblica per il browser;
- **Studio URL**, di solito `http://127.0.0.1:54323`.

Copia `apps/web/.env.example` in `apps/web/.env.local` e sostituisci le due variabili:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=LA_TUA_CHIAVE_PUBBLICA
```

**Non incollare mai `service_role`, secret API key, password del DB o `RESEND_API_KEY` nel file `.env.local` del frontend.** Riavvia `npm run dev` per caricare le nuove variabili.

## 3. Avviare il servizio inviti

Serve una terza finestra di `cmd` nella radice del progetto:

```cmd
npx supabase functions serve invitations --no-verify-jwt
```

Il parametro `--no-verify-jwt` è intenzionale **soltanto** perché l'azione pubblica di riscatto del link richiede assenza di sessione; il codice `supabase/functions/invitations/index.ts` verifica internamente utente e ruolo per *ogni* azione amministrativa. Non esporre altre funzioni con la stessa impostazione senza audit di sicurezza.

Inviti creati con modalità **link** non richiedono alcun provider email. Per inviarli automaticamente via email, in una successiva configurazione puoi fornire al processo Edge:
- `RESEND_API_KEY` (segreto server-only);
- `INVITE_EMAIL_FROM` (mittente verificato presso Resend);
- `APP_PUBLIC_URL` (URL pubblico dell'app, quando distribuita);
- `APP_ALLOWED_ORIGINS` (origini frontend HTTPS consentite, separate da virgole);
- `RATE_LIMIT_SALT` (segreto casuale server-side distinto dai token).

Se il provider email non è configurato, l'app crea comunque un link da copiare e mostra che la consegna via email non è riuscita.

## 4. Creare il primo amministratore

Poiché il signup pubblico è **disabilitato**, solo la configurazione amministrativa iniziale può creare il primo utente.

1. Apri **Supabase Studio** locale (es. `http://127.0.0.1:54323`).
2. Nella sezione **Authentication → Users**, aggiungi il tuo utente via pannello amministrativo con email e password robusta; conferma l'email se richiesto.
3. Apri **SQL Editor** in Studio ed esegui questo SQL, **sostituendo il segnaposto con la TUA email**:

   ```sql
   insert into public.app_admins(user_id)
   select id from auth.users
   where lower(email) = lower('LA_TUA_EMAIL@example.com')
   on conflict (user_id) do nothing;
   ```

4. Apri l'app, accedi con quel profilo e usa la sezione **Amministrazione**.

**Non mettere la tua email nel codice sorgente o in una migration condivisa.** Le azioni admin vengono controllate lato server. Un normale utente non può creare inviti tramite chiamate dirette al browser.

## 5. Provare il primo invito

1. Effettua l'accesso con l'account admin.
2. Vai in **Amministrazione**, inserisci l'email di un altro utente e scegli **Genera link da copiare**.
3. Copia subito il link (il token non è recuperabile dopo la chiusura della schermata); scade dopo **7 giorni** e si usa una sola volta.
4. Apri il link in una finestra privata o in un browser separato: così non interrompi la sessione admin.
5. Imposta una password di almeno 12 caratteri e crea l'account.
6. Il nuovo utente può creare e gestire **solo i propri personaggi**.

Se il riscatto viene interrotto dopo il consumo del token ma prima della creazione dell'account, il link non viene riutilizzato: l'amministratore deve emettere un nuovo invito.

## 6. Come fermare tutto

- Terminale Vite: **Ctrl+C**.
- Terminale funzione inviti: **Ctrl+C**.
- Servizi Supabase Docker: da `cmd` nella root, `npm run supabase:stop`.

**NON eseguire `npm run supabase:reset`** se desideri conservare i personaggi locali: elimina il database Supabase locale e lo ricrea.

## Stato e limiti attuali

### Implementato nella Fase 2

- Accesso email/password agli account precreati o invitati; signup pubblico disabilitato nella configurazione locale.
- Invito link monouso di 7 giorni, revocabile dall'amministratore. Invio email solo con provider configurato.
- Ruolo amministratore sul server; elenco account; sospensione/riattivazione (nessuna auto-sospensione).
- Registro amministrativo (inserimento di operazioni importanti; la pulizia dopo un anno sarà automatizzata successivamente).
- Personaggi privati via RLS; uno attivo; creazione e modifica di dati iniziali; ricerca/filtri; archivio/cestino e recupero entro 30 giorni.
- Concorrenza ottimistica: salvataggi respinti quando la revisione non è quella corrente; revisioni append-only consultabili (prime 100).
- IT/EN per schermate principali; tema chiaro/scuro; funzioni esistenti della PWA.

### NON ancora implementato / non pronto per produzione

- Sincronizzazione offline di schede, cifratura dei dati personali locali e meccanismo di sblocco offline. **Non usare la PWA per dati sensibili reali in questa versione**: i token Supabase sono gestiti dal normale storage della sessione del browser.
- Risoluzione interattiva di conflitti campo per campo, recupero automatico e revision restore.
- Recupero password assistito dall'amministratore, cancellazione account con 30 giorni di recupero, cancellazione definitiva automatica del cestino, retention automatizzata del log admin a un anno.
- Modifica completa della scheda, catalogo 2014, sottoclassi, incantesimi, condizioni, calcoli D&D avanzati e homebrew.
- Backup/esportazioni PDF o ZIP e notifiche nuovi dispositivi / accessi sospetti.
- Test di integrazione su database live e build frontend eseguita nell'ambiente di generazione (lì npm registry non era accessibile).

La versione presente è una **consegna iniziale della Fase 2**, adatta a prove con dati fittizi in Supabase locale, non a rilascio su Internet.
