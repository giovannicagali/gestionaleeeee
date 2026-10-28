# Architettura — decisioni e perimetro (Fase 1)

```text
apps/web          React + Vite, UI e shell PWA
packages/shared   Tipi condivisi + validatori preliminari
packages/rules-engine  Matematica D&D minima, testabile offline
packages/sync     Contratti e funzioni pure; NESSUNA sincronizzazione attiva
supabase/         Schema PostgreSQL, policy RLS, config locale
```

## Sicurezza
- Chiave pubblica Supabase (`anon`/publishable) **non è un segreto**, ma la `service_role`/secret non deve mai arrivare al frontend.
- RLS sul database è attivo per le tabelle di base. Il progetto hostato va configurato con signup pubblico disabilitato. Gli inviti monouso e la verifica amministratore saranno implementati nella Fase 2; non affidarli a un semplice link client-side.
- In Fase 1 IndexedDB conserva solo preferenze non sensibili (lingua, tema). **Non** è stata realizzata la cifratura di schede/token offline né la verifica offline del dispositivo.
- Niente scrittura personaggi dalla UI: revisioni server-side e controllo concorrenza saranno progettati prima dell'editing.
- Service worker: cache solo per app shell e asset statici; nessuna API privata viene aggiunta alle cache runtime.
- Aggiornamenti PWA: richiesta esplicita, senza refresh forzato. Prima delle vere modifiche offline occorrerà integrare il blocco aggiornamento con la coda di sync.

## Vincoli funzionali già decisi
- Accesso per invito, un solo personaggio attivo, cestino 30 giorni.
- Offline cifrato e conflitti per campo, cronologia revisioni persistente.
- D&D 5e 2014; catalogo secondo licenze applicabili; homebrew senza script eseguibili.
- Non salvare contenuti di manuali proprietari finché i diritti di utilizzo non sono stati verificati.

## Nota sulle tabelle
`characters.sheet` è un contenitore JSONB **provvisorio**, non lo schema definitivo. Migrations ulteriori introdurranno revisioni, eventi, record di conflitto, oggetti e indici; eventuali modifiche devono passare per transazioni di backend che garantiscano integrità e idempotenza.

## Checklist prima di esporre account veri
1. Sicurezza degli inviti: tokens a uso singolo, 7 giorni, revoca e autorizzazione admin verificata server-side.
2. Confermare impostazioni Auth sul progetto hostato, inclusa disabilitazione signup pubblico e link redirect autorizzati.
3. Test automatici RLS con almeno due utenti e verifica impossibilità di lettura/scrittura incrociata.
4. Schema revisioni e funzioni transazionali prima dell'editing.
5. Threat model per cifratura locale persistente + sblocco offline e gestione chiavi.
6. Rate limiting e audit admin, logging senza segreti, lifecycle cancellazione.
7. CORS, CSP, backup/PITR e storage bucket privati prima di deploy pubblico.
