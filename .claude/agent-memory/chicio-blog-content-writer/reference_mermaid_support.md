---
name: Mermaid diagram support in Posts
description: Post MDX supports Mermaid diagrams via fenced code blocks — no imports needed, renders client-side with the Matrix Theme
type: reference
---

Mermaid diagrams are available in MDX Posts as fenced code blocks with the `mermaid` language identifier:

````
```mermaid
graph TD
    A[Node] --> B[Node]
```
````

**How it works:** Handled automatically by `apps/website/src/mdx-components.tsx` — no component import is needed in the MDX file. Renders client-side (`apps/website/src/components/features/mdx/mermaid-diagram/`) with the Matrix Theme.

**Supported diagram types:** Flowcharts (`graph TD`/`graph LR`), sequence diagrams, class diagrams, state diagrams, and all other standard Mermaid diagram types.

**How to apply:** When writing technical Posts that describe architectures, pipelines, flows, or state machines, consider using a Mermaid diagram instead of (or alongside) bullet lists. First used in the LLM guardrails Post (2026-04-26) to visualize the three-layer guardrail pipeline.
