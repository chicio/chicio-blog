# website-content

A **Project Plugin**: it only works on this repository. It writes the Website's content: Posts in Fabrizio Duroni's
voice, and new entries in the Manga and Videogames collections. Its vocabulary (Post, Topic, Exercise, Manga, Volume,
Console, Game, …) is the Website context, in [`apps/website/GLOSSARY.md`](../../apps/website/GLOSSARY.md).

It loads in place in this repository: `.claude/settings.json` enables it from the `chicio-labs` marketplace at the
repository root, so an edit, or a `git pull`, takes effect after `/reload-plugins`. On a fresh clone the project's
`SessionStart` hook installs it during the first session; run `/reload-plugins` when it says so.

## Skills

| Skill                                  | What it does                                                                                                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/website-content:write-post`          | A new Post, or an English Post from an Italian draft: the interview and the outline approval happen in the main thread, the `writer` agent drafts, then review rounds and the PR. Also routes Post reviews, DSA course edits and memory updates to the agent. |
| `/website-content:write-new-manga`     | Adds a Manga to the collection, or processes the shelf photos of an existing one.                                                                                                                                                                             |
| `/website-content:write-new-videogame` | Adds a Game to an existing Console in the Videogames collection.                                                                                                                                                                                              |

## Agent

`website-content:writer` (opus) writes and edits content in Fabrizio's editorial voice. For a new Post or a
translation it is dispatched by `write-post` with an approved brief and never interviews the user itself; call it
directly for a Post review, a DSA course edit or a memory update. Its memory is in
`.claude/agent-memory/website-content-writer/`. The featured-image specification it hands to image generators is
in [`references/`](references/).

## Prerequisites

- [`uv`](https://docs.astral.sh/uv/): the collection skills run their Python scripts with `uv run --script`, which
  installs their dependencies on the fly.
- `write-new-videogame` needs `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET` in `.env.others` at the repository root.
- `write-new-manga` uses AniList's public GraphQL API, which needs no key.
