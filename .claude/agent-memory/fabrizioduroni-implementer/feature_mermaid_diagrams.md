# Mermaid Diagrams in MDX

## Overview
MDX content supports Mermaid diagrams via fenced code blocks with `mermaid` language identifier. No imports needed in MDX files — detection and rendering is automatic.

## Architecture
- **Detection**: `src/lib/mermaid/mermaid.ts` — `extractMermaidDefinition()` checks for `language-mermaid` in `pre > code` className
- **MDX mapping**: `src/mdx-components.tsx` — `pre` handler dispatches to `MermaidDiagram` or `CodeBlock`
- **Component**: `src/components/design-system/molecules/diagram/mermaid-diagram.tsx` — client component, renders via `useEffect`
- **Loader**: `src/components/design-system/utils/loader/mermaid-loader.ts` — singleton lazy loader (cached Promise pattern), handles `import("mermaid")` + `initialize()` once, provides unique render IDs

## Key Decisions
- **No `next/dynamic`**: Using `import("mermaid")` inside `useEffect` instead of `next/dynamic` with `ssr: false`. The `ssr: false` approach caused an infinite page-reload loop in React dev mode due to `BAILOUT_TO_CLIENT_SIDE_RENDERING` recovery cycles.
- **Lazy singleton**: Mermaid is loaded on first diagram render, not at module level. The cached Promise ensures `initialize()` runs once even with multiple diagrams on the same page.
- **Matrix theme**: Custom `themeVariables` with green-on-dark palette. Node backgrounds use `#002a00` (not `#001100`) to be visible against the container `bg-[#001100]`.

## Customization
- **Per-diagram overrides**: Use `%%{init: {"flowchart": {"nodeSpacing": 80, "rankSpacing": 70}}}%%` directive at the top of the mermaid definition
- **Node classes**: Assign CSS classes to nodes with `A:::myClass` syntax
- **Supported types**: Flowcharts, sequence diagrams, class diagrams, state diagrams, and all standard Mermaid diagram types
