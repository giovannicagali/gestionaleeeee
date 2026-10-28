# Registro verifica — Fase 2 (prima consegna)

## Controlli eseguiti qui

- Verificata la presenza dell'intero monorepo di Fase 1 come base della nuova consegna.
- Test pure TypeScript con Node 22 `--experimental-strip-types`: **11/11 superati**, inclusi i quattro nuovi test di validazione iniziale del personaggio.
- Analisi sintattica TypeScript/TSX tramite parser TypeScript globale: **22 file**, nessun errore di sintassi.
- Nessuna chiave `service_role` inserita nell'app frontend; la Edge Function usa il secret solo sul server.
- Verificate staticamente le scelte strutturali: RLS, revoca di INSERT/UPDATE diretti, RPC con revisioni attese, token invito SHA-256 e consumo atomico, bootstrap admin manuale, signup disabilitato nel config locale.

## Verifiche NON ancora possibili qui

- `npm install`, `npm run build`, `npm run typecheck` del frontend: **registro npm non raggiungibile in questo ambiente** (errore `EAI_AGAIN`).
- Applicazione migrazioni e test SQL su Postgres/Supabase reale: Docker e `psql` non disponibili in questo ambiente.
- Test end-to-end dell'Edge Function locale e dell'invio email Resend: ambiente server/Supabase e credenziali non presenti.

## Checklist per la prossima sessione su Windows

1. `npm install` e `npm run build` dal progetto Fase 2: risolvere eventuali errori compilazione.
2. `npm run supabase:start` e applicazione migration con database locale nuovo.
3. `npx supabase functions serve invitations --no-verify-jwt`.
4. Provisioning primo admin in Studio e login.
5. Invito -> riscatto in browser privato -> login nuovo utente.
6. Utente A e B: verificare isolamento delle rispettive schede.
7. Creare due personaggi e verificare vincolo di un solo attivo.
8. Modificare stesso personaggio da due browser: seconda scrittura con revisione precedente deve essere rifiutata.
9. Archivio, cestino e ripristino; controllare cronologia revisioni.
10. Sospensione account; le letture delle schede devono essere bloccate tramite RLS.
11. Verificare che una chiamata non autenticata all'azione admin dell'Edge Function restituisca `admin_required`.

## Non implementato intenzionalmente

Cifratura offline, reset password assistito, cancellazione account, pulizia automatica, sincronizzazione offline, anteprima ripristino revisioni, sistema completo D&D, immagine del personaggio e backup cloud. La documentazione principale spiega i limiti.
