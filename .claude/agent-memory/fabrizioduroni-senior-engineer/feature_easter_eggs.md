---
name: Easter Eggs System
description: Hidden Matrix-themed features triggered via search and special interactions
type: project
---

Easter eggs in `src/components/sections/easter-eggs/`:

- **Neo Room** (`neo-room-easter-egg.tsx`): Matrix-themed terminal with "Knock, knock" button and sound effects. Uses MatrixTerminal animation component with typed text/quote sequences and configurable delays.
- **White Rabbit** (`white-rabbit.tsx`): Hidden feature
- **Dejavu** (`dejavu.tsx`): Hidden feature

Easter eggs can be triggered via search results — the search system has `EasterEggTerminalLines` type in `src/types/search/search.ts` that supports terminal animation sequences with text/quote types and delays.
