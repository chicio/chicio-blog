# chicio-labs-sdlc

A **Project Plugin**: it only works on this repository. It holds the agentic SDLC pipeline that builds code changes to
chicio-blog, and the release checklist. Its vocabulary (Human Gate, Approved Plan, Work Unit, Wave, Unit Checks, Full
Checks, Unit Review, Integration Review) is the Agentic Delivery context, in [`../GLOSSARY.md`](../GLOSSARY.md); why the
pipeline is shaped this way is [ADR-0001](../docs/adr/0001-parallel-work-units-in-a-workflow.md).

It loads in place in this repository: `.claude/settings.json` enables it from the `chicio-labs` marketplace at the
repository root, so an edit, or a `git pull`, takes effect after `/reload-plugins`. On a fresh clone the project's
`SessionStart` hook installs it during the first session; run `/reload-plugins` when it says so.

## Skills

| Skill                            | What it does                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `/chicio-labs-sdlc:sdlc`         | Runs a code change from description to pull request.                          |
| `/chicio-labs-sdlc:release-prep` | The checklist before `npm run release`: changelog, lint, build, version bump. |

```
/chicio-labs-sdlc:sdlc [description] [--fix] [--in-place]
```

- **Feature mode** (default): explore, then the **Human Gate**, where Fabrizio approves the plan and its Work Unit
  Graph, then the workflow builds it, then the pull request opens.
- **Fix mode** (`--fix`, or a pasted stack trace): investigate the root cause, confirm it at the Human Gate, then the
  same workflow, starting from a failing regression test.
- **Isolation**: the pipeline runs in its own worktree on a `feat/<slug>` branch unless `--in-place` is passed.

The pipeline is for code. Posts and DSA course edits go to `/chicio-blog-content:write-post`.

## The workflow

`chicio-labs-sdlc:workflow` (`workflows/workflow.js`) is the part after the Human Gate. It builds the Approved Plan Wave
by Wave: the Work Units of a Wave run in parallel, each in its own worktree, each looping between implementer and Unit
Review until it converges; the Waves are merged into the feature branch; then the Full Checks, the Integration Review
and, when UI, routes or flows changed, a live QA run. The `sdlc` skill starts it; it is never run on its own.

## Agents

| Agent              | Model  | Role                                                                                       |
| ------------------ | ------ | ------------------------------------------------------------------------------------------ |
| `explorer`         | sonnet | Read-only map of the files, design-system pieces and registration points a change touches. |
| `implementer`      | sonnet | Builds one Work Unit (code and tests, micro-commits) and passes its Unit Checks.           |
| `code-reviewer`    | opus   | Unit Review of one Work Unit, or the Integration Review of all of them.                    |
| `gate-runner`      | haiku  | Runs the Full Checks once per integration round and returns GREEN, RED or ENVIRONMENT.     |
| `e2e-sentinel`     | sonnet | Drives the running site with agent-browser to check a UI, route or flow change.            |
| `bug-investigator` | opus   | Fix mode: a root-cause report from the error, the code and the git history.                |

Each is addressed as `chicio-labs-sdlc:<agent>`. The `implementer` can also be called directly for a trivial,
well-specified change that does not need the pipeline.

- **Memory**: `implementer`, `code-reviewer` and `bug-investigator` keep project memory in
  `.claude/agent-memory/chicio-labs-sdlc-<agent>/`. Renaming the plugin or an agent means moving that folder.
- **Permissions**: plugin agents ignore `permissionMode`, so the agents that edit files follow the session's
  permission mode; the pipeline is meant to run in auto mode.
- **CodeGraph**: comes from the repository's `.mcp.json`; agents that use it list `mcp__codegraph__codegraph_explore`
  under their tools.
