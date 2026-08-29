---
paths:
  - "apps/website/src/components/**/*"
  - "packages/eslint-plugin-chicio/**/*"
  - "apps/website/.dependency-cruiser.js"
---

# Component Architecture

This is the authoritative reference for how UI components are structured, typed, and enforced in this codebase. All conventions described here are at error level in ESLint and dependency-cruiser — violations fail CI.

## Folder-Per-Component

Every component lives in its own kebab-case folder where the folder name equals the `.tsx` basename:

```
packages/matrix-design-system/src/atoms/buttons/pill-button/
    pill-button.tsx          # component
    use-pill-button-store.ts # store hook
    index.ts                 # barrel
```

Rules:
- The folder name and the `.tsx` filename must match exactly.
- An `index.ts` barrel re-exports ONLY the component and any public prop types. It never re-exports hooks.
- Category grouping directories (`atoms/buttons/`, `atoms/effects/`, `features/easter-eggs/`, etc.) are pure namespaces — they hold component folders but contain no `.tsx` files directly.

## One Hook Per Component File

A component `.tsx` file may call EXACTLY ONE hook — its own `use<ComponentName>Store()`.

**Permanent exception**: `useGlassmorphism` may be called directly in component files. It is a pure derived-styling hook (returns `.glassmorphism` or `.glassmorphism-lite` based on the user's motion preference) with no local state and no side effects. It does not violate the one-hook contract.

No other `use*` calls are permitted in component `.tsx` files. Store hook files (`use-*-store.ts`) may call any number of hooks.

## No Functions in JSX

`react/jsx-no-bind` is enforced at error level. Inline arrow functions and `.bind()` in JSX props are forbidden.

To pass parameterized handlers, curry them in the store and destructure before the return:

```tsx
// In the store:
const handleDelete = (id: string) => () => { deleteItem(id); };

// In the component:
const { handleDelete } = effects;
return <button onClick={handleDelete(item.id)} />;
```

Always destructure `effects` (and `state`) before the JSX return so the component never references the bound object inline.

## Store Return Contract

A store returns ONLY the halves it has, typed with a named type from `@/types/component-store`:

| Return type | Use when |
|---|---|
| `void` | Pure side-effect hook, no state or effects exposed |
| `StateStore<S>` | State only (`{ state: S }`) |
| `EffectsStore<E>` | Effects only (`{ effects: E }`) |
| `ComponentStore<S, E>` | Both (`{ state: S; effects: E }`) |

Never pad an empty half with `Record<string, never>` or `{}`. Never inline `{ state; effects }` as a literal type — always use the named types.

The component destructures only the half that the store returns:

```tsx
// StateStore: only state
const { state } = useMyComponentStore();

// EffectsStore: only effects
const { effects } = useMyComponentStore();

// ComponentStore: both
const { state, effects } = useMyComponentStore();
```

## DOM Refs

React Compiler's `react-hooks/refs` rule forbids refs escaping through the returned `{state, effects}` object, and accessing a ref-like value inline in JSX taints the whole `effects` binding.

Convention for element refs:
- Hold the node via `const [el, setEl] = useState<HTMLElement | null>(null)` (or an internal `useRef` that is never returned).
- Read the node inside effects, not in render.
- Expose the setter via `effects.setEl`.
- In the component, destructure before the JSX return: `const { setEl } = effects; return <div ref={setEl} />;`

A `RefObject` that is only attached (never `.current`-read in render, e.g. from a shared `useInView`) may pass through `state` and be used as `ref={navRef}`.

Never use `document.querySelector`. Never allowlist `useRef` in eslint-disable comments.

## Shared Hooks

Shared hooks (used by 2+ consumers) live in `packages/matrix-design-system/src/hooks/` when they are generic UI
concerns. A hook that depends on this site belongs to its feature domain instead: `useSearch` lives in
`apps/website/src/components/features/search/`, next to `features/consent/use-consent-store.ts`. There is no layer bucket
under `features/` — every folder there is named for a domain, never for a kind of file. They may return callback refs (e.g. `useInViewList` returns a `setEl` callback). The consuming store calls the shared hook and re-exposes its callback ref via `effects`.

Global `useSyncExternalStore`-based stores (e.g. `useMotionStore`) keep their names and snapshot caching — they are not subject to the `use-*-store.ts` naming convention because they are not component-scoped.

## Placement by Consumer Count

- A child used by exactly 1 consumer nests inside that consumer's folder (private, sealed by dependency-cruiser).
- A child used by 2+ consumers hoists to the nearest shared ancestor folder.

## Worked Example

```
packages/matrix-design-system/src/molecules/accordion/accordion-item/
    accordion-item.tsx
    use-accordion-item-store.ts
    index.ts
```

`use-accordion-item-store.ts`:
```ts
import { ComponentStore } from "@/types/component-store";

interface AccordionItemState { isOpen: boolean; }
interface AccordionItemEffects { toggle: () => void; }

export const useAccordionItemStore = (defaultOpen = false): ComponentStore<AccordionItemState, AccordionItemEffects> => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
    return { state: { isOpen }, effects: { toggle } };
};
```

`accordion-item.tsx`:
```tsx
import { useAccordionItemStore } from "./use-accordion-item-store";

export const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
    const { state, effects } = useAccordionItemStore();
    const { isOpen } = state;
    const { toggle } = effects;
    return (
        <div>
            <button onClick={toggle}>{title}</button>
            {isOpen && <div>{children}</div>}
        </div>
    );
};
```

`index.ts`:
```ts
export { AccordionItem } from "./accordion-item";
export type { AccordionItemProps } from "./accordion-item";
```

## Layering (Atomic Design)

Enforced by dependency-cruiser at error:
- atoms may not import from molecules or organism
- molecules may not import from organism
- `design-system/**` may not import from `features/**` (features are injected at the app/composition layer via props)
- content pages may not import from each other (`content-page-isolation`)
- imports crossing a component folder boundary must go through `index.ts`
- nested private folders are sealed (only the parent component folder may import from a nested sub-folder)
- no circular dependencies

## Directory Homes

- `packages/matrix-design-system/src/hooks/` — shared hooks (incl. `useSyncExternalStore` stores and shared ref hooks like `useInViewList`)
- `packages/matrix-design-system/src/atoms/` — basic UI elements
- `packages/matrix-design-system/src/molecules/` — composed from atoms
- `packages/matrix-design-system/src/organism/` — complex composed sections (the top design-system layer)
- `apps/website/src/components/features/content/` — page-level layouts (`page-template`, `content-page-template`,
  `reading-content-page-template`); these arrange this site's chrome, so they are not part of the
  reusable design system
- `apps/website/src/components/features/design-system-next/` — the site's Next bindings for design-system components
  (next/link, next/image, the router path, the logo). Website code imports these, not the raw
  design-system components that need injection
- `apps/website/src/components/content/<page>/` — page-scoped components (one folder per route)
- `apps/website/src/components/features/<feature>/` — cross-cutting UI not tied to a route, one folder per domain; a
  site-specific shared hook lives in its domain folder (e.g. `features/search/use-search.ts`)
- `apps/website/src/lib/` — pure business logic (no JSX); non-hook utilities live here
- `packages/matrix-component-store` — `ComponentStore`, `StateStore`, `EffectsStore` type definitions

`design-system/utils/` has been eliminated — non-hook pure logic lives in `apps/website/src/lib/`, shared SEO/structured-data components in `apps/website/src/components/features/seo/`.

## Enforcement

Run these commands to check compliance:

```bash
npm run lint                # ESLint: chicio/prefer-component-store, store-return-shape,
                            # index-only-component, folder-composition + react/jsx-no-bind
                            # all at error; --max-warnings 0 in CI
npm run validate-architecture  # dependency-cruiser: all rules at error
```

ESLint plugin source: `packages/eslint-plugin-chicio/rules/`
- `prefer-component-store` — one hook per component file (useGlassmorphism permanently exempt)
- `store-return-shape` — store returns only the named typed halves it has
- `index-only-component` — index barrels export only components and prop types
- `folder-composition` — folder name must match component filename
