# Memory Index — fabrizioduroni-code-reviewer

Compounding review heuristics (recurring violation patterns worth catching faster). One line per memory file.
No per-PR facts — those go stale.

- [e2e-launch-timeout-flake.md](e2e-launch-timeout-flake.md) — scattered e2e failures with "browserType.launch Timeout" are parallel-load flakes; re-run failing specs --workers=1 before calling a regression
- [recharts-legend-text-color.md](recharts-legend-text-color.md) — recharts Legend text color must use labelStyle (or per-item formatter), not wrapperStyle; entry.color overrides inherited color
