# DSA Exercise Generation Pipeline

This document contains the detailed steps for fetching exercises from GitHub and generating exercise MDX files.
It is referenced by the `fabrizioduroni-dsa-senior-engineer` agent during Steps 7-8e.

## Step 7: Fetch Exercises from GitHub

Use the **GitHub CLI (`gh`)** via Bash for all GitHub operations:

1. **Create the topic folder** if it does not exist: `src/content/data-structures-and-algorithms/topic/<topic-name>/`
2. **Create the exercises subfolder**: `src/content/data-structures-and-algorithms/topic/<topic-name>/exercises/`
3. **List the `.ts` files** in the Algomaster-Solutions repo folder:
   ```bash
   gh api repos/chicio/Algomaster-Solutions/contents/src/<folder-name> --jq '.[] | select(.name | endswith(".ts")) | .name'
   ```
4. **Download each `.ts` file** to the exercises subfolder:
   ```bash
   gh api repos/chicio/Algomaster-Solutions/contents/src/<folder-name>/<file>.ts --jq '.content' | base64 -d > src/content/data-structures-and-algorithms/topic/<topic-name>/exercises/<file>.ts
   ```
   If there are multiple source folders, fetch from all of them.

### Shell Safety Rules (avoid permission prompts)

Claude Code's safety analysis blocks certain shell patterns. To avoid permission prompts, follow these rules strictly:

- **Never use `for` loops** to batch-download files. Instead, run each `gh api ... | base64 -d > path` as a **separate Bash command**. You can run multiple Bash commands in parallel.
- **Never use brace expansion** (`{a,b,c}`) in `mkdir` or any command. Instead, run `mkdir -p` once per directory, or list full paths separated by spaces.
- **Never use shell variable interpolation in redirect targets** (e.g., `> "$dir/$file"`). Always use **literal, fully-resolved paths** in redirects.
- **Never use `head`/`cat`/`tail` in `for` loops.** Use the Read tool instead of Bash for reading file contents, or run individual commands per file.

**Note**: Always use `gh` CLI for any GitHub operation (fetching files, listing contents, etc.). Never use raw `curl` calls to the GitHub API.

## Step 8: Generate Exercise MDX Files

For each `.ts` file downloaded in Step 7, generate an exercise MDX page. Process each file as follows:

### 8a. Parse the `.ts` file

Read the file and extract:
- **LeetCode URL**: from a comment line like `* https://leetcode.com/problems/<slug>/`
- **Title slug**: the `<slug>` portion of the URL
- **Problem number and title**: from a comment line like `* 39. Combination Sum`
- **Code**: everything after the header comment block (`/** ... */`), stripped clean

### 8b. Fetch problem metadata from LeetCode

Use the LeetCode GraphQL API via `curl` in Bash to fetch the problem description and topic tags:

```bash
curl -s -X POST https://leetcode.com/graphql \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -H "Referer: https://leetcode.com/problems/<title-slug>/" \
  -d '{"operationName":"questionData","query":"query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { title content topicTags { name } } }","variables":{"titleSlug":"<title-slug>"}}'
```

**Rate limiting**: Wait at least 0.5 seconds between requests (`sleep 0.5`) to avoid being blocked by LeetCode.

The `content` field contains HTML. Strip HTML tags to get plain text for the problem summary.

### 8c. Write the exercise MDX file

Create `topic/<topic-name>/exercise/<file-stem>/content.mdx` with this structure:

```mdx
---
title: "<Problem Title>"
description: "<First sentence of the problem description, max 200 chars>"
date: <YYYY-MM-DD of today>
image: /images/posts/data-structures-and-algorithms-featured.png
tags: <same tags as the topic article>
authors: [fabrizio_duroni]
metadata:
  technique: "<Technique — inferred from your understanding of the topic and how the exercise relates to it>"
  leetcodeUrl: "https://leetcode.com/problems/<slug>/"
---
# <Problem Title>

Leetcode Problem <number>: [<Problem Title>](https://leetcode.com/problems/<slug>/description/)

## Problem Summary
<Clean, clear summary of the problem - see rules below>

## Techniques
<List of topic tags from LeetCode, one per line with - prefix>

## Solution
```ts
<code from the .ts file, header comment stripped>
\```
```

### 8d. Problem Summary Quality Rules

The problem summary must be written cleanly, not raw-copied from LeetCode:

- Clearly explain the problem request in plain English
- Convert constraints to a **descriptive format** (e.g., "Timestamps are positive integers up to **1,000,000,000** milliseconds" instead of raw `1 <= t <= 10^9`)
- **Remove all examples** from the description (they bloat the page)
- Convert any images referenced in the LeetCode description to **ASCII diagrams** or textual descriptions
- Keep it concise but complete enough that a reader understands the problem without visiting LeetCode

See existing exercises for reference: `topic/queue/exercise/number-of-recent-calls/content.mdx`, `topic/backtracking/exercise/combination-sum/content.mdx`.

### Step 8e: Clean Up Downloaded Exercise Files

After all exercise MDX files have been generated, remove the `exercises/` subfolder that was created in Step 7.
It was only needed as a temporary staging area for the raw `.ts` files and must not be committed to the repository.

```bash
rm -rf src/content/data-structures-and-algorithms/topic/<topic-name>/exercises/
```

Do this automatically without asking the user.
