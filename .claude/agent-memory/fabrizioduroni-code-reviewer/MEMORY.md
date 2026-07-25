# Memory Index — fabrizioduroni-code-reviewer

Compounding review heuristics (recurring violation patterns worth catching faster). One line per memory file.
No per-PR facts — those go stale.

- [e2e-launch-timeout-flake.md](e2e-launch-timeout-flake.md) — scattered e2e failures with "browserType.launch Timeout" are parallel-load flakes; re-run failing specs --workers=1 before calling a regression
- [recharts-legend-text-color.md](recharts-legend-text-color.md) — recharts Legend text color must use labelStyle (or per-item formatter), not wrapperStyle; entry.color overrides inherited color
- [e2e-in-worktree-webserver.md](e2e-in-worktree-webserver.md) — e2e in isolated worktrees can fail on webServer startup (EADDRINUSE / stale .next / prebuild rmSync); recover deterministically before calling it a regression
- [e2e-search-listbox-flake.md](e2e-search-listbox-flake.md) — search.spec.ts:36 (query→listbox options) flakes under parallel workers; line 44 uses identical query and passes — re-run --workers=1 before blaming a search-index change
- [e2e-selector-must-be-feature-unique.md](e2e-selector-must-be-feature-unique.md) — never let an e2e assertion key off a shared Tailwind utility (bg-black-alpha-75 has 3 owners); demand a feature-unique selector
- [dynamic-ssr-false-event-drain-latch.md](dynamic-ssr-false-event-drain-latch.md) — LayoutAdditionalContent features are dynamic(ssr:false); window-event triggers fired pre-mount are lost and need a pending-flag drain latch
