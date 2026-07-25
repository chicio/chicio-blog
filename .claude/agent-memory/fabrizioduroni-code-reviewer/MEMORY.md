# Memory Index — fabrizioduroni-code-reviewer

Compounding review heuristics (recurring violation patterns worth catching faster). One line per memory file.
No per-PR facts — those go stale.

- [e2e-launch-timeout-flake.md](e2e-launch-timeout-flake.md) — scattered e2e failures with "browserType.launch Timeout" are parallel-load flakes; re-run failing specs --workers=1 before calling a regression
- [recharts-legend-text-color.md](recharts-legend-text-color.md) — recharts Legend text color must use labelStyle (or per-item formatter), not wrapperStyle; entry.color overrides inherited color
- [e2e-in-worktree-webserver.md](e2e-in-worktree-webserver.md) — e2e in isolated worktrees can fail on webServer startup (EADDRINUSE / stale .next / prebuild rmSync); recover deterministically before calling it a regression
- [e2e-search-listbox-flake.md](e2e-search-listbox-flake.md) — search.spec.ts:36 (query→listbox options) flakes under parallel workers; line 44 uses identical query and passes — re-run --workers=1 before blaming a search-index change
- [metadata-adapter-to-passthrough-divergence.md](metadata-adapter-to-passthrough-divergence.md) — deleting a field-picking metadata adapter for raw pass-through: check for extra MDX keys the adapter dropped AND whether any consumer serializes metadata wholesale (search/markdown/manifest read named fields, so extra keys are inert)
- [knip-does-not-ignore-test-files.md](knip-does-not-ignore-test-files.md) — knip.json has no `ignore` key and includes test files in `project`, so knip green does NOT prove a deletion is complete; grep production code yourself
- [e2e-command-palette-flake.md](e2e-command-palette-flake.md) — terminal.spec.ts/search.spec.ts openPalette-driven specs flake under load; disjoint failing sets across runs = flake, not regression; never pipe playwright through `tail` (masks exit code)
