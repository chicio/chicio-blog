# Panoramica del progetto

Il mio progetto è un blog personale realizzato con Next.js, React e styled-components.  
Presenta un design pulito e moderno, focalizzato sulla leggibilità e sull’esperienza utente.  
Il design è ispirato al film *The Matrix*.  
Il blog include diverse sezioni come articoli, categorie e una pagina “about”.  
Scrivo principalmente di tecnologia, programmazione ed esperienze personali.

## Struttura delle cartelle

- `/posts`: cartella che contiene gli articoli del blog in formato Markdown.  
- `/src/app`: cartella principale dell’app router di Next.js.  
- `/src/components/`: cartella che contiene i componenti React e gli hook.  
  - `/src/components/design-system`: il design system con i blocchi base dell’interfaccia utente, organizzati secondo l’approccio atomic design.  
  - `/src/components/sections`: cartella che contiene varie sottocartelle, una per ciascuna sezione del sito.  
    Ogni cartella associata a una sezione contiene a sua volta una cartella `components` con i componenti React e una cartella `hooks` con i custom hook usati nella sezione.  
- `/src/lib`: cartella che contiene la logica di business e le funzioni di utilità.  
- `/src/types`: cartella che contiene i tipi TypeScript usati nel progetto.  

## Librerie e Framework

- **Next.js** per la generazione statica del sito e il server-side rendering.  
- **styled-components** + **@styled-icons** per lo stile dei componenti e delle icone.  
- **framer-motion** per animazioni e transizioni.  
- **@ai-sdk/groq** e **@ai-sdk/react** per la sezione chat.  
- Librerie **remark**, **graymatter**, **katex** e **rehype** per il parsing e il rendering dei contenuti Markdown.  
- **elasticlunr** per la funzionalità di ricerca lato client.  