/**
 * design-sync shim for `elasticlunr`.
 *
 * Not a reimplementation — it loads the real package. The only thing added is the side-effect import
 * below, which declares the legacy `lunr` global that elasticlunr assigns to on load (see
 * ./elasticlunr-global.ts for why that throws otherwise).
 *
 * `CommandPalette` genuinely depends on this via `use-command-palette-store` → `useSearch`, so the
 * library has to stay in the bundle for that component to work.
 *
 * The real package is imported by explicit relative path because `.design-sync/tsconfig.sync.json`
 * maps the bare specifier `elasticlunr` to this file — importing it by name here would be circular.
 */
import "./elasticlunr-global";
import elasticlunr from "../../node_modules/elasticlunr/elasticlunr.js";

export default elasticlunr;
