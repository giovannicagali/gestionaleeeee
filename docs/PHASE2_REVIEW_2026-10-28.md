# Fase 2 — Revisione del 28/10/2026 (v0.2.1)

## Stato realistico

**Nucleo della Fase 2 operativo in locale**, già verificato dall'utente: login email/password, ruolo admin visibile, migrazioni/tabelle Supabase presenti, creazione e modifica di un personaggio con persistenza iniziale. **Collaudo completo NON ancora certificato**: alcuni percorsi richiedono test manuali con due account e Supabase in esecuzione sul PC dell'utente; altre funzioni pianificate non esistono ancora nel codice.

### Correzioni implementate in 0.2.1

1. Opzioni delle tendine (specie, sottospecie, classe e allineamento), filtri, card e intestazione personaggio tradotte in italiano/inglese. Valori persistiti immutati (es. `Fighter`) per non rompere le schede già presenti.
2. Corretto `supabase/config.toml`: `[auth.email].enable_signup = true`, mantenendo `[auth].enable_signup = false`. Risolve la configurazione che impediva i login email locali (la modifica equivalente era stata applicata manualmente sul PC).
3. Conferma se esistono modifiche non salvate quando si passa da Personaggi ad Amministrazione o si esce dall'account.
4. Aggiunti tre test automatici sulle traduzioni, inclusa compatibilità con i valori già archiviati.

### Controlli che posso effettuare sul sorgente

| Controllo | Stato | Risultato |
|---|---|---|
| Test puri del nucleo (shared/rules/sync) | Eseguito | 14/14 superati |
| Parsing sintattico TypeScript e TSX | Eseguito | 24 file, 0 errori sintattici |
| RLS e privilegi del database (ispezione codice) | Ispezione statica | Policy per proprietario; RPC con controllo auth/revisione; **non sostituisce test sul database** |
| Segreti nel browser | Ispezione statica | Client configurato solo con chiave pubblica, non con service-role |
| Login e primo personaggio dal PC | Segnalato dall'utente | Funzionano nella versione 0.2.0 locale |
| `npm run build` e typecheck React completi | Da eseguire su Windows | Registro npm non accessibile qui; compilazione non certificata |
| Inviti, sicurezza tra utenti, sospensione, cestino, revisioni | Da provare su Windows | Richiedono test end-to-end sul DB locale |

### Prove da fare sul PC, senza cancellare il database

**Prima di tutto**: non usare `supabase db reset`, `npm run supabase:reset`, `docker compose down -v` né *Reset to factory defaults* in Docker. Conserva una copia della cartella della Fase 2 e del file `apps/web/.env.local` (che non è dentro lo ZIP).

1. Estrarre questa versione in una nuova cartella; copiare manualmente **solo** il proprio `apps/web/.env.local` dalla cartella corrente. Non condividere quel file in chat.
2. Nella nuova cartella eseguire `npm install`, `npm run test`, `npm run build`, quindi `npm run dev`. Lasciare Docker e il Supabase locale già avviati sul PC. **Non eseguire una migrazione/reset: questo aggiornamento non modifica lo schema SQL.**
3. Con lingua italiana, aprire un personaggio con valori inglesi già salvati: verificare che siano mostrati come `Nano`, `Guerriero`, ecc. Cambiare lingua su EN e tornare su IT senza alterare i valori.
4. Modificare la storia senza salvare, poi cliccare Amministrazione: deve chiedere conferma; scegliendo Annulla non deve perdere il testo. Ripetere con pulsante Esci.
5. Creare **un account di prova distinto**, usando Amministrazione → Genera link. Per questo test assicurarsi che `npx supabase functions serve invitations --no-verify-jwt` sia in esecuzione in un terminale separato. Aprire link in navigazione privata, impostare password (almeno 12 caratteri), verificare accesso. Non mandare link/token a nessuno.
6. Confermare che il secondo utente non vede i personaggi del primo; creare personaggio B. Tentare accesso ai personaggi altrui usando i normali comandi dell'app (e opzionalmente test API con utenti di prova, senza credenziali nella chat).
7. Verificare un personaggio attivo per account: creandone un secondo il precedente deve risultare archiviato, poi poter attivare l'altro.
8. Archiviare un personaggio, spostarlo nel cestino, ripristinarlo e verificare le revisioni; controllare che la scheda rimanga recuperabile dopo un refresh.
9. Aprire lo **stesso personaggio in due browser/sessioni**: salvare una modifica nel browser A, poi una versione vecchia nel browser B; il salvataggio B deve essere rifiutato con `conflict_or_missing` (il confronto guidato non è ancora implementato).
10. In Amministrazione verificare revoca invito; sospendere/riattivare **solo l'account di prova** e controllare accesso/permessi; verificare il registro amministrativo.

### Funzionalità ancora mancanti o parziali (non dichiarare Fase 2 chiusa per il rilascio)

- Recupero password tramite amministratore; cancellazione account con recupero 30 giorni; pulizia automatica del cestino; pulizia audit dopo un anno.
- Immagini dei personaggi, creazione guidata completa, opzioni di background realmente a catalogo, multiclassamento e calcoli delle regole (Fasi successive).
- Confronto/ripristino guidato revisioni; risoluzione visuale dei conflitti; sincronizzazione offline; backup/cloud.
- Test di integrazione verificati sul database reale, test di sicurezza e deploy.
- Invio email automatico inviti non disponibile finché non si configura il provider server-side.

**Decisione per fine giornata:** usare il nuovo ZIP come base di sviluppo, senza sovrascrivere/cancellare lo stato locale. La Fase 2 resta **funzionante nel flusso base, con collaudo end-to-end incompleto** finché le prove 5–10 non vengono effettivamente svolte. Nessuna funzionalità mancante viene presentata come completa.
