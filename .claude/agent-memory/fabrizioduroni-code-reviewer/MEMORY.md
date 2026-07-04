# Memory Index — fabrizioduroni-code-reviewer

Compounding review heuristics (recurring violation patterns worth catching faster). One line per memory file.
No per-PR facts — those go stale.

- [e2e-launch-timeout-flake.md](e2e-launch-timeout-flake.md) — scattered e2e failures with "browserType.launch Timeout" are parallel-load flakes; re-run failing specs --workers=1 before calling a regression
