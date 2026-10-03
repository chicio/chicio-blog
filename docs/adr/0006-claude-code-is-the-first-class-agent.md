# Claude Code is the first-class agent

The repository's agent setup targets Claude Code alone, instead of staying tool-agnostic. Project instructions live in
`CLAUDE.md`, not in an `AGENTS.md` that `CLAUDE.md` imports, and third-party skills are copied into `.claude/skills/`
(`npx skills add <package> --agent claude-code --copy`, still pinned by `skills-lock.json`) instead of being installed
once in `.agents/skills/` and symlinked into each agent's folder. The tooling this repository builds for its agents
(mods, subagents, the SDLC workflow) only runs in Claude Code, and it ships as Claude Code plugins; a file named for
every agent but written for one would mislead, and a shared skills folder kept for agents nobody runs here is cost
without a user.

## Consequences

- Codex, Cursor and other tools following the AGENTS.md convention get no project instructions. Reverting means
  restoring `AGENTS.md` as the source and `CLAUDE.md` as its `@AGENTS.md` import, and reinstalling skills without
  `--agent claude-code --copy`.
- `next dev`, when an agent runs it, keeps managing its rules block in the Next project directory
  (`node_modules/next/dist/server/lib/generate-agent-files.js`): with no `AGENTS.md` there it upserts the block into
  `CLAUDE.md`, and it scaffolds a new `AGENTS.md` only when neither file exists. A stray `AGENTS.md` appearing in a diff
  is that generator, not a regression of this decision.
- Turborepo's agent guidance can only be written to a root `AGENTS.md`, so it is turned off (`"agentGuidance": false`
  in `turbo.json`) and its note lives in `CLAUDE.md` by hand.
