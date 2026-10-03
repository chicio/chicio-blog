# Glossary Browser

A Claude Code plugin that keeps a repository's ubiquitous language in view while you work. It reads the glossary the
repository already has (`GLOSSARY-MAP.md`, each context's `GLOSSARY.md`, the ADRs), shows it in a band above the prompt
and a pane you can explore, and its **Term Check** steers you and the model away from the words the glossary says to
avoid.

It is a mod: a plugin of function hooks that runs inside Claude Code (terminal or desktop).

## Install

```
/plugin marketplace add chicio/chicio-blog
/plugin install glossary-browser@chicio-labs
/reload-plugins
```

## Works with Matt Pocock's domain-modeling skills

The Glossary Browser reads exactly the files that Matt Pocock's
[`domain-modeling`](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) skill writes,
so it pairs with that skill and with
[`grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs), the
[`grilling`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling) session that runs
`domain-modeling` and records the terms and decisions as they settle. Grill a plan, and the terms the session
resolves show up in the band and the pane, and the Term Check starts steering toward them. Install the skills with:

```
npx skills add mattpocock/skills -s domain-modeling grill-with-docs grilling
```

It follows the skill's current convention, `GLOSSARY.md` and `GLOSSARY-MAP.md`
([GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md)).
Versions of the skill before 2026-08-15 wrote `CONTEXT.md` and `CONTEXT-MAP.md`: rename them to adopt it.

## What your repository needs

Either a single `GLOSSARY.md` at the repository root (one context), or a `GLOSSARY-MAP.md` there that links each
context's glossary:

```md
# Glossary Map

## Contexts

- [Ordering](./src/ordering/GLOSSARY.md): receives and tracks customer orders
- [Billing](./src/billing/GLOSSARY.md): generates invoices

## Relationships

- **Ordering → Billing**: Ordering emits OrderPlaced; Billing invoices it
```

Each `GLOSSARY.md` lists its terms under `## Language`, optionally grouped by `###` sections:

```md
**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: bill, payment request
```

ADRs are read from `docs/adr/*.md` at the root (system-wide) and inside each context's folder. Without a glossary the
plugin stays quiet.

## Using it

- **The band** above the prompt names the contexts and counts the terms and ADRs. Focus it (ctrl+x tab, or click) and
  press `g` to open the pane. When the Term Check has flagged words, they appear in the band: press `1` to `3` to open
  a flagged term, `x` to clear the flags.
- **`/glossary [term]`** opens the pane, on that term when one is given.
- **The pane** lists the contexts on the left, each expandable to its terms (by section) and its ADRs, plus the
  system-wide ADRs and the map's Relationships. The right side shows the selection: a term's definition, its _Avoid_
  entry, the words the Term Check flags for it, and where the same word means something in another context; an ADR
  rendered as Markdown. Type in the filter to search every term, definition and ADR title. Esc closes it.

The glossary is read live, and re-read when a `GLOSSARY.md`, the map or an ADR is edited in the session. The plugin
never writes it.

## The Term Check

It looks for _Avoid_ words in two places:

- **Your prompts.** The prompt goes through exactly as typed, with a note only the model reads: each word, its context
  and the canonical term (`'task' is an Avoid word in Agentic Delivery: when it means Work Unit, say Work Unit`). The
  model uses the canonical terms in its reply and its work, and ignores a line when the word was meant in another
  sense. Every context's list applies, since a prompt has no path.
- **The model's edits to Markdown** (`.md`, `.mdx`). An edit to a file inside a context's folder is checked against
  that context's list. If it uses an _Avoid_ word, the edit is **refused** with the canonical terms, so the model
  rewrites it; when the word is meant (a quote, code, another sense), sending the same edit again unchanged lets it
  through. An edit to a file outside every context is checked against all of them and only flagged; with a single root
  `GLOSSARY.md`, its one context owns every file. `GLOSSARY.md` and `GLOSSARY-MAP.md` themselves are never checked.

What it does not count as a hit: code blocks and inline code, HTML or JSX tags, link targets, an _Avoid_ word that is
part of a canonical name (the glossary's "design" inside "Design System"), and _Avoid_ entries that are guidance
rather than words ("using it for a block inside a page").

## Configuration

| Option      | Default | Effect                                                                                         |
| ----------- | ------- | ---------------------------------------------------------------------------------------------- |
| `denyEdits` | `true`  | Refuse Markdown edits that use the owning context's _Avoid_ words. Off, they are only flagged. |

Set it with `claude plugin configure glossary-browser@chicio-labs`.

## Limits

The Term Check is a convenience, not enforcement: it runs only in Claude Code, and the retry lets any word through by
design. A rule every contributor and every tool must follow belongs in lint or CI.

## Development

From the repository root:

```
claude plugin validate claude-plugins/glossary-browser
claude plugin test claude-plugins/glossary-browser
```

CI runs both on every push. `tsc -p claude-plugins/glossary-browser` type-checks the mod once a Claude Code session has
loaded it, since the engine writes the type declarations it extends at load time. Releases go through the
`release-plugin.yml` workflow, which bumps `version` in `.claude-plugin/plugin.json`, writes `CHANGELOG.md` and tags
`glossary-browser--v<version>`.
