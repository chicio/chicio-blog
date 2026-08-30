# matrix-component-store

The return-type contract for the component-store pattern: a component stays a pure rendering
function, and everything it needs comes from exactly one hook.

This package is **types only** — it has no runtime code, and its built output is literally
`export {}`. It exists so several packages can share one vocabulary for that boundary instead of
each redeclaring it.

```bash
npm install --save-dev matrix-component-store
```

## The pattern

A component calls exactly one hook, `use<ComponentName>Store()`, which returns its state and its
effects. The component then does nothing but render them.

```tsx
import type { ComponentStore } from "matrix-component-store";

interface AccordionState {
    open: boolean;
}

interface AccordionEffects {
    toggle: () => void;
}

export const useAccordionStore = (): ComponentStore<AccordionState, AccordionEffects> => {
    const [open, setOpen] = useState(false);
    const toggle = useCallback(() => setOpen((o) => !o), []);

    return { state: { open }, effects: { toggle } };
};
```

```tsx
export const Accordion: FC<AccordionProps> = ({ title, children }) => {
    const { state, effects } = useAccordionStore();

    return (
        <section>
            <button onClick={effects.toggle}>{title}</button>
            {state.open && <div>{children}</div>}
        </section>
    );
};
```

## The three types

| Type | Use when the component has |
|---|---|
| `ComponentStore<TState, TEffects>` | both state and behaviour |
| `StateStore<TState>` | state only, no callbacks |
| `EffectsStore<TEffects>` | behaviour only, no state |

`StateStore` and `EffectsStore` exist so a store with only one half does not have to pad the other
with `Record<string, never>` or `{}`. Reach for the narrowest one that fits.

## Why bother

Keeping state and effects behind a single hook per component means the rendering code has no
branching logic to test around, and the hook can be exercised on its own. It also makes the seam
obvious in review: if a component file calls a second hook, the boundary has leaked.

## License

MIT © Fabrizio Duroni
