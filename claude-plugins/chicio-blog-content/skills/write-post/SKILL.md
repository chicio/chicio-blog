---
name: write-post
description: Write a new Post, or turn an Italian draft into one, for chicio-blog — interview and outline approval in the main thread, drafting by chicio-blog-content:writer, review rounds, then the PR. Also routes Post reviews, DSA course edits and writer memory updates to the agent.
disable-model-invocation: false
---

# chicio-blog-content:write-post — orchestrator

You (the main thread) own every conversation with Fabrizio; **`chicio-blog-content:writer`** owns the writing. A
subagent cannot hold a real back-and-forth, so the interview, the outline gate and the review rounds happen here, and
the agent receives an approved brief and never asks the user anything.

Vocabulary: "Post" is the canonical term (see `apps/website/CONTEXT.md`), never "article".

## Invocation

```
/chicio-blog-content:write-post [topic or draft path] [--translate] [--review <post>] [--dsa <topic or exercise>] [--memory]
```

Pick the mode from the arguments or the request:

| Mode | Trigger | Flow |
|---|---|---|
| **New Post** | default | Interview → outline gate → draft → review rounds → publish |
| **Translate** | `--translate`, or an Italian draft is given | Gap interview → translate → review rounds → publish |
| **Review** | `--review`, "review my post about…" | Dispatch the agent's review workflow; relay its findings; apply only on request |
| **DSA edit** | `--dsa`, a correction to a Topic or Exercise | Agree the change here, then dispatch; the agent follows its `dsa_editing_conventions.md` |
| **Memory** | `--memory`, "update the writer memory" | Dispatch the agent's memory-update workflow |

Create a todo list with one item per stage of the selected mode.

## Stage 0 — Branch

Content work never happens on `main`. Unless you are already on the Post's branch, create `feat/content/<slug>` from an
up-to-date `origin/main` (agree the slug in Stage 1 first for a new Post). The agent works on the branch it is given
and does not create one.

## Stage 1 — Interview 🚪 [INTERACTIVE]

Load **`grilling`** and **`domain-modeling`** with the Skill tool and run the interview as a grilling session.

- **New Post, round 1** asks together: the topic; the repository with the example code, if any; the detailed
  description of what to cover (links, docs, snippets, specific angles); where the code lives if it is not in a
  repository; images, screenshots or YouTube links to include; and whether a featured image exists.
- **Translate**: read the draft fully first. Ask only what the draft cannot supply (featured image, repository links,
  images or videos, Tags); the draft is the source of truth for content and structure.
- Finding facts is your job: read the code in this repository or in a linked repository yourself instead of asking,
  and check existing Posts for cross-references and Tags already in use.
- **Glossary scope**: `domain-modeling` here is for **site** vocabulary only. Write to `apps/website/CONTEXT.md` when a
  Post introduces or changes a concept of the site itself (a new Section, a new kind of content, a new Easter Egg).
  The technical subject of the Post (a framework, a pattern) is never a glossary term. Most Posts write nothing.

## Stage 2 — Outline gate 🚪 [INTERACTIVE] (New Post only)

Draft the outline yourself: title, description, Tags, a section-by-section breakdown with bullets, where code, images
and videos go, and cross-references to existing Posts. Iterate until Fabrizio approves it. **Do not dispatch the writer
before the outline is approved.** The approved outline plus every Stage 1 answer is the **brief**.

## Stage 3 — Draft

Dispatch **`chicio-blog-content:writer`** with the brief (or, for Translate, the draft path plus the gap answers),
the branch name, and the instruction to stop after the draft: write the MDX and media, generate the featured-image
prompt if one is needed, run `npm run lint` and `npm run build`, and return. Do not let it commit yet.

Relay what it returns **in full** in your reply: the draft path, the featured-image prompt (with the reminder to attach
`claude-plugins/chicio-blog-content/references/featured-image-reference.png`), and for Translate every flagged idiom with its alternatives. Tool
results are invisible to Fabrizio.

## Stage 4 — Review rounds 🚪 [INTERACTIVE]

Fabrizio reads the draft. Turn his feedback into precise edit instructions and send them to the **same** agent
(SendMessage), so it keeps its context; relay each result. Repeat until he says the Post is ready. For Translate, every
flagged spot must be settled here.

## Stage 5 — Publish

Once Fabrizio says the Post is ready, tell the agent to publish: commit `feat(content): :sparkles: <title>`, push, open
the PR, and update its memory with the new Post. If `domain-modeling` wrote to `CONTEXT.md` in Stage 1, commit that
first as a separate `docs(content): :memo:` commit. Relay the PR link.

**Never merge.** Merging is Fabrizio's call.
