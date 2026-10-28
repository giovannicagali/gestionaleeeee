# Schede D&D — Archivio locale

Gestionale per creare e gestire schede personaggio D&D. Questa versione funziona **solo nel browser**, senza account, Supabase o backend.

## Pubblicazione su GitHub e Vercel

1. Carica su GitHub il contenuto completo di questa cartella, mantenendo la struttura delle directory.
2. In Vercel importa il repository GitHub. Il file `vercel.json` configura già build e cartella di output.
3. Usa Node.js 22 o successivo se Vercel richiede la scelta della versione.

## Funzionamento

- Personaggi salvati in IndexedDB tramite Dexie sul dispositivo/browser corrente.
- Creazione, modifica, attivazione, archiviazione, cestino e ripristino dei personaggi.
- Interfaccia italiana/inglese e tema chiaro/scuro.
- Pulsanti **Esporta** e **Importa** per eseguire backup JSON manuali.

## Importante

I dati non vengono inviati a un server e non si sincronizzano tra browser o dispositivi. Se cancelli i dati del sito/browser, puoi perdere l'archivio: esporta periodicamente un backup e conservalo in un luogo sicuro. L'importazione unisce i personaggi del backup a quelli presenti; in caso di ID uguali, il personaggio importato sostituisce quello locale.

La pubblicazione su Vercel distribuisce solo i file dell'app: non abilita sincronizzazione, account o backup automatici.
