# Claude tooling ships as plugins from a marketplace in this repository

The repository root is a Claude Code plugin marketplace, `chicio-labs` (`.claude-plugin/marketplace.json`), and the
tooling built for agents (skills, subagents, the SDLC workflow, mods) lives in its plugins under `claude-plugins/`,
instead of loose in `.claude/`. A plugin is the unit Claude Code installs, versions, namespaces and hot-reloads, and some
of this tooling is meant for other repositories: a Public Plugin such as `glossary-browser` is installed elsewhere with
`/plugin marketplace add chicio/chicio-blog`, while a Project Plugin (`chicio-labs-sdlc`, `chicio-blog-content`) only
works here. One catalogue lists both, and each plugin's description says which it is.

## Considered Options

- **Keep everything in `.claude/`**: a mod already loads from `.claude/skills/<name>/`, but nothing there is
  installable elsewhere or versioned.
- **A separate repository per plugin**: the obvious shape for a published plugin, but it splits the tooling from the
  glossary, ADRs and code it is developed against.
- **A second, private marketplace for the Project Plugins**: the repository is public, so it would hide nothing, at
  the cost of a second catalogue.

## Consequences

- Not everything can move. Rules (`.claude/rules/`), `CLAUDE.md`, permissions and agent memory
  (`.claude/agent-memory/`) are read from the project only, so `.claude/` stays as configuration.
- Every component is namespaced `<plugin>:<name>`; renaming a plugin renames all of them, which is why the plugins are
  named for what they serve (`chicio-labs-sdlc` serves the whole repository, `chicio-blog-content` the site).
- A plugin agent's memory folder is `.claude/agent-memory/<plugin>-<agent>/`, so a rename moves the agent's memory
  too.
- Plugin subagents ignore `permissionMode`, `mcpServers` and `hooks`. MCP tools come from the project's `.mcp.json`.
- This repository loads the plugins in place: `.claude/settings.json` declares the marketplace with a `directory`
  source, so an edit takes effect after `/reload-plugins`. Everyone else gets a copy cached per `version`, so a Public
  Plugin only reaches them when `release-plugin.yml` bumps its version and tags `<plugin>--v<version>`. A Project
  Plugin carries no version.
- Project settings enable the plugins but never install them on a new machine, so a `SessionStart` hook installs the
  missing ones for each checkout, and they load after `/reload-plugins`.
- CI validates and tests every plugin without Claude credentials (`claude plugin validate`, `claude plugin test`); type
  declarations for mods are written by the engine when a session loads them, so `tsc` is a local check only.
