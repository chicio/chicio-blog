---
name: Editorial Insights and Patterns
description: Key editorial patterns, co-author registry, article series, and style observations extracted from the full blog archive
type: reference
---

## Co-Author Registry

These are all co-authors who have appeared on blog posts, useful for attribution and collaboration context:

- **marco_de_lucchi** — iOS/SwiftUI colleague. Co-authored: Hermes RN (2020), SwiftUI Path (2022), Widget iOS (2023), SwiftUI Text (2023), Locale iOS (2025)
- **francesco_bonfadelli** — Clean code colleague. Co-authored: IDE comparison (2018), Hermes RN (2020). Sole author: Chain of Responsibility refactoring (2018)
- **felice_giovinazzo** — Backend colleague. Co-authored: RN Native Modules Android (2018), Pact contract testing (2021)
- **alessandro_romano** — React/RN colleague. Co-authored: Voxxed 2018 conference talk (2018)
- **alex_stabile** — Backend/web colleague. Co-authored: Jackson SPI (2022), Microfrontends (2022)
- **tommaso_resti** — Mobile colleague. Co-authored: IDE comparison (2018)
- **mariano_patafio** — RN colleague. Co-authored: RCTBundleURLProvider debugging (2018)
- **emanuele_ianni** — Testing colleague. Co-authored: Golden master testing (2018)
- **giordano_tamburrelli** — iOS colleague. Co-authored: Enterprise beta distribution (2018)
- **angelo_sciarra** — Agile colleague. Co-authored: Code review (2018)
- **stefano_varesi** — Backend colleague. Co-authored: Pact contract testing (2021)
- **sam_campisi** — RN colleague. Co-authored: React Universe 2024 (2024)
- **antonino_gitto** — iOS/RN colleague. Co-authored: Locale iOS (2025), Skia Gradients (2025)

## Article Series

### Blender Tutorial Series (15 parts, 2018-01 to 2019-03)
Complete beginner-to-advanced Blender 3D tutorial. Posts #1-#15 covering UI, selection, modeling, advanced modeling, outliner, materials, textures, light, camera, animation, rigging, Cycles.

### Clean Code Series (3 parts, 2017-2019)
Inspired by Robert C. Martin. Posts: Meaningful Names (2017), Objects/Data Structures/Law of Demeter (2018), Functions (2019).

### ID3TagEditor/Mp3ID3Tagger Series (3 parts, 2018-05)
Open source project showcase. Birth story, framework deep dive, macOS app with RxSwift.

### PBR/Computer Graphics Series (multiple posts, 2017-2018)
Phong model, reflection vector, PBR introduction, SceneKit PBR. Academic/mathematical content.

### PWA Series (5 parts, 2019-2020)
Progressive Web App journey: PWA creation, Google Play Store publishing, pull-to-refresh, offline GA tracking, Workbox service worker.

### React Native Bridge/Native Modules Series (2 parts, 2018-12)
Architecture for RN native module communication on Android and iOS.

### Web-to-Native Communication Series (2 parts, 2019)
JavaScript to native code via WKScriptMessageHandler (iOS) and JavaScript Interfaces (Android).

### MVP Architecture Series (2 parts, 2017)
Model View Presenter on iOS (Swift) and Android (Java) with unit testing.

### Swift Closure Series (2 parts, 2017-06)
Definition/syntax and @escaping/@autoclosure attributes.

### Advent of TypeScript 2023 Series (5 parts, 2023-12 to 2024-01)
Type-level programming challenges: intro, Rock Paper Scissors, Tic Tac Toe, Connect 4, Santa maze.

### SwiftUI Series (ongoing, multiple co-authored)
Custom TabBar (2020), UIKit bridge (2020), Path/Shape (2022), Widget debugging (2023), Text concatenation (2023).

### React Native Skia Series (ongoing, 2024-2025)
Custom shapes (2024), Carousel parallax (2024), Text gradients (2025). Visual-heavy, YouTube videos.

### SPM Series (2 parts, 2019 + 2020)
Creating cross-platform Swift libraries and bundling resources with SPM.

## Tag Frequency (most used)

High frequency: swift, ios, apple, mobile application development, javascript, web development, react native, typescript, computer graphics, blender
Medium frequency: clean code, test driven development, pwa, android, java, swiftui
Lower frequency: kotlin, spring boot, backend, architectural pattern, domain driven design, react, conference, machine learning, llm, expo, skia, dsa, ai, chrome

## Editorial Voice Observations

1. **Opening pattern**: Almost always starts with italic abstract that echoes/expands the description, followed by `---` horizontal rule
2. **"Let's see/Let's start"** transitions are extremely common
3. **Personal motivation framing**: Often starts with why (work project, side project, curiosity)
4. **Newbie humility**: Frequently self-identifies as a learner ("for newbies like me", "beginners like me")
5. **Enthusiastic vocabulary**: "cool stuff", "pretty cool", "super powers", "SUPER simple", "love at first sight"
6. **YouTube videos**: Many posts include video demos, especially iOS/RN posts
7. **Co-authoring is common**: ~20 out of 88 posts are co-authored, especially with work colleagues
8. **Cross-platform pairs**: Several topics covered for both iOS and Android (MVP, web-to-native, RN bridges)

## Content Structure for Blog Posts

Posts are stored at: `src/content/blog/post/[year]/[month]/[day]/[slug]/content.mdx`
- This differs from the CLAUDE.md system prompt which mentions `src/content/posts/`
- The actual directory structure uses nested year/month/day/slug directories
- Images referenced from `/images/posts/` (public directory)
- YouTube import: `import { Youtube } from "@/components/design-system/molecules/video/youtube";`

## Publication Frequency

- 2017: 13 posts (blog launch year, high output)
- 2018: 24 posts (highest output year, includes Blender series bulk)
- 2019: 20 posts (Blender series completion + PWA series)
- 2020: 9 posts (output dropped, COVID year)
- 2021: 5 posts (lower output, more backend focus)
- 2022: 4 posts (lowest output year)
- 2023: 4 posts (SwiftUI + Advent of TypeScript)
- 2024: 6 posts (AoT completion + RN Skia + conference)
- 2025: 5 posts (so far: TypeScript types, LLM, locale, Skia gradients, DSA)
- 2026: 2 posts (Chrome Built-in AI, LLM chatbot guardrails)
- **Total: 89 posts**
