#!/usr/bin/env python3
"""
create-dsa-exercise-content.py

Converts TypeScript exercise files to MDX format for DSA topics.

For each topic/<topic>/exercises/*.ts file:
  1. Extracts Leetcode URL, problem number, title, and TypeScript code
  2. Matches the technique from the static exercises table in topic/content.mdx
  3. Fetches description, problem summary, and topic tags from Leetcode GraphQL API
  4. Generates topic/<topic>/exercise/<slug>/content.mdx
  5. Replaces the static exercises table in topic/content.mdx with <TopicExercises />

Usage:
  python3 scripts/create-dsa-exercise-content.py           # all topics
  python3 scripts/create-dsa-exercise-content.py backtracking  # one topic
"""

import os
import re
import sys
import time
import json
import requests
from pathlib import Path
from datetime import date
from html.parser import HTMLParser
from html import unescape


# ── Config ────────────────────────────────────────────────────────────────────

CONTENT_ROOT = (
    Path(__file__).parent.parent
    / "src"
    / "content"
    / "data-structures-and-algorithms"
    / "topic"
)
TODAY = date.today().isoformat()
DEFAULT_IMAGE = "/images/posts/data-structures-and-algorithms-featured.png"
DEFAULT_AUTHOR = "fabrizio_duroni"
LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"
TOPIC_EXERCISES_IMPORT = (
    'import { TopicExercises } from'
    ' "@/components/sections/data-structures-and-algorithms/components/topic-exercises";'
)


# ── HTML → plain text ─────────────────────────────────────────────────────────

class _HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self._parts: list[str] = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip = True
        elif tag == "li":
            self._parts.append("\n- ")
        elif tag in ("p", "br", "div"):
            self._parts.append("\n")
        elif tag in ("strong", "b"):
            self._parts.append("**")
        elif tag in ("em", "i"):
            self._parts.append("*")
        elif tag == "code":
            self._parts.append("`")
        elif tag == "pre":
            self._parts.append("\n```\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = False
        elif tag in ("strong", "b"):
            self._parts.append("**")
        elif tag in ("em", "i"):
            self._parts.append("*")
        elif tag == "code":
            self._parts.append("`")
        elif tag == "pre":
            self._parts.append("\n```\n")

    def handle_data(self, data):
        if not self._skip:
            self._parts.append(data)

    def get_text(self) -> str:
        text = unescape("".join(self._parts))
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def strip_html(html: str) -> str:
    s = _HTMLStripper()
    s.feed(html)
    return s.get_text()


# ── Leetcode GraphQL ──────────────────────────────────────────────────────────

_QUERY = """
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    title
    content
    topicTags { name }
  }
}
"""


def fetch_leetcode(title_slug: str) -> dict:
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": f"https://leetcode.com/problems/{title_slug}/",
    }
    try:
        resp = requests.post(
            LEETCODE_GRAPHQL_URL,
            json={"operationName": "questionData", "query": _QUERY,
                  "variables": {"titleSlug": title_slug}},
            headers=headers,
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json().get("data", {}).get("question") or {}
    except Exception as exc:
        print(f"    ⚠️  Leetcode fetch failed for '{title_slug}': {exc}")
        return {}


# ── TS file parsing ───────────────────────────────────────────────────────────

def _slug_to_title(slug: str) -> str:
    """combination-sum-ii → Combination Sum Ii  (best-effort fallback)."""
    return " ".join(w.capitalize() for w in slug.split("-"))


def parse_ts_file(ts_path: Path) -> dict:
    """Return title, title_slug, problem_number, leetcode_url, code, stem."""
    text = ts_path.read_text(encoding="utf-8")

    url_m = re.search(r"\*\s*(https://leetcode\.com/problems/([\w-]+))", text)
    if url_m:
        leetcode_url = url_m.group(1).rstrip("/") + "/"
        title_slug = url_m.group(2)
    else:
        leetcode_url = ""
        title_slug = ts_path.stem

    num_m = re.search(r"\*\s*(\d+)\.\s*(.+)", text)
    problem_number = num_m.group(1) if num_m else ""
    title = num_m.group(2).strip() if num_m else _slug_to_title(ts_path.stem)

    # Strip header comment block, keep the rest as-is
    code = re.sub(r"^/\*\*.*?\*/\s*", "", text, flags=re.DOTALL).strip()

    return {
        "stem": ts_path.stem,
        "title": title,
        "title_slug": title_slug,
        "problem_number": problem_number,
        "leetcode_url": leetcode_url,
        "code": code,
    }


# ── Technique matching from static table ─────────────────────────────────────

def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def extract_techniques_map(content_mdx: str) -> dict[str, str]:
    """
    Parses the static ## Exercises table from a topic's content.mdx.
    Returns { normalized_title: technique }.
    Table format (either header name):
      | [Title](url) | Technique | [Solution](...) |
    """
    techniques: dict[str, str] = {}
    m = re.search(r"## Exercises\n(.*?)(?=\n## |\Z)", content_mdx, re.DOTALL)
    if not m:
        return techniques
    for row in re.finditer(r"\|\s*\[([^\]]+)\]\([^)]+\)\s*\|\s*([^|]+?)\s*\|", m.group(1)):
        techniques[_norm(row.group(1))] = row.group(2).strip()
    return techniques


def find_technique(techniques: dict, stem: str, title: str) -> str:
    """Match by title first, then by stem-derived title."""
    for candidate in (title, _slug_to_title(stem)):
        key = _norm(candidate)
        if key in techniques:
            return techniques[key]
    return "TODO"


# ── MDX generation ────────────────────────────────────────────────────────────

def _first_sentence(text: str) -> str:
    """Return first meaningful sentence, capped at 200 chars."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    sentence = lines[0] if lines else ""
    if len(sentence) > 200:
        sentence = sentence[:197] + "..."
    return sentence


def generate_mdx(ts: dict, technique: str, lc: dict, topic_tags: str) -> str:
    title = ts["title"]
    leetcode_url = ts["leetcode_url"]
    problem_number = ts["problem_number"]
    code = ts["code"]
    title_slug = ts["title_slug"]

    if lc.get("content"):
        plain = strip_html(lc["content"])
        description = _first_sentence(plain).replace('"', '\\"')
        problem_summary = plain
    else:
        description = title.replace('"', '\\"')
        problem_summary = "TODO: Add problem summary."

    if lc.get("topicTags"):
        techniques_block = "\n".join(f"- {t['name']}" for t in lc["topicTags"])
    else:
        techniques_block = "- TODO"

    lc_problem_num = f"Leetcode Problem {problem_number}: " if problem_number else ""

    return f"""---
title: "{title}"
description: "{description}"
date: {TODAY}
image: {DEFAULT_IMAGE}
tags: {topic_tags}
authors: [{DEFAULT_AUTHOR}]
metadata:
  technique: "{technique}"
  leetcodeUrl: "{leetcode_url}"
---
# {title}

{lc_problem_num}[{title}]({leetcode_url}description/)

## Problem Summary
{problem_summary}

## Techniques
{techniques_block}

## Solution
```ts
{code}
```
"""


# ── topic/content.mdx patching ────────────────────────────────────────────────

def patch_topic_content(content: str, topic: str) -> str:
    """
    1. Adds the TopicExercises import (after the last existing import line).
    2. Replaces the static ## Exercises table with <TopicExercises topic="..." />.
    """
    # ── Import ──
    if "TopicExercises" not in content:
        # Find the last import line and insert after it
        last_import_end = None
        for m in re.finditer(r"^import .+;$", content, re.MULTILINE):
            last_import_end = m.end()
        if last_import_end is not None:
            content = (
                content[:last_import_end]
                + "\n"
                + TOPIC_EXERCISES_IMPORT
                + content[last_import_end:]
            )
        else:
            # No existing imports after frontmatter — add right after closing ---
            content = re.sub(
                r"(---\n\n)",
                r"\1" + TOPIC_EXERCISES_IMPORT + "\n\n",
                content,
                count=1,
            )

    # ── Table replacement ──
    # Matches: ## Exercises\n<optional blank line><table header + separator + rows>
    content = re.sub(
        r"(## Exercises\n)\n?(\|[^\n]*\n)*",
        r"\1\n<TopicExercises topic=\"" + topic + r"\" />\n",
        content,
    )

    return content


# ── Process one topic ─────────────────────────────────────────────────────────

def process_topic(topic_dir: Path) -> None:
    topic = topic_dir.name
    exercises_dir = topic_dir / "exercises"
    content_mdx_path = topic_dir / "content.mdx"

    if not exercises_dir.exists():
        return

    ts_files = sorted(exercises_dir.glob("*.ts"))
    if not ts_files:
        return

    print(f"\n📂  {topic}  ({len(ts_files)} exercises)")

    content_mdx = content_mdx_path.read_text(encoding="utf-8") if content_mdx_path.exists() else ""

    # Parse tags from topic frontmatter (e.g. [backtracking, recursion, ...])
    tags_m = re.search(r"^tags:\s*(\[.*?\])", content_mdx, re.MULTILINE)
    topic_tags = tags_m.group(1) if tags_m else "[data structures, algorithms]"

    techniques_map = extract_techniques_map(content_mdx)

    for ts_path in ts_files:
        ts = parse_ts_file(ts_path)
        slug = ts["stem"]

        output_path = topic_dir / "exercise" / slug / "content.mdx"

        if output_path.exists():
            print(f"  ⏭️   {slug}  (skipped — already exists)")
            continue

        print(f"  🔄  {slug}")

        lc = fetch_leetcode(ts["title_slug"])
        time.sleep(0.5)  # be polite to Leetcode

        technique = find_technique(techniques_map, slug, ts["title"])
        mdx = generate_mdx(ts, technique, lc, topic_tags)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(mdx, encoding="utf-8")
        print(f"  ✅  Created {output_path.relative_to(CONTENT_ROOT.parent.parent.parent)}")

    # Patch topic content.mdx (replace table + add import)
    if content_mdx and "TopicExercises" not in content_mdx:
        patched = patch_topic_content(content_mdx, topic)
        content_mdx_path.write_text(patched, encoding="utf-8")
        print(f"  📝  Patched {content_mdx_path.name}")


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    if len(sys.argv) > 1:
        topic_dir = CONTENT_ROOT / sys.argv[1]
        if not topic_dir.is_dir():
            print(f"Error: topic '{sys.argv[1]}' not found at {topic_dir}")
            sys.exit(1)
        process_topic(topic_dir)
    else:
        for topic_dir in sorted(CONTENT_ROOT.iterdir()):
            if topic_dir.is_dir():
                process_topic(topic_dir)

    print("\n✅  Done!")


if __name__ == "__main__":
    main()
