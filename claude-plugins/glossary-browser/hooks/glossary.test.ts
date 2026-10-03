import { describe, expect, test } from "claude-code/testing";

import {
    avoidWordsOf,
    check,
    contextsForPath,
    denyReason,
    elsewhere,
    isOwnedPath,
    parseContext,
    parseContextMap,
    promptNote,
    search,
    singleContextEntry,
} from "./glossary";

const MAP = `# Glossary Map

## Contexts

- [Website](./apps/website/GLOSSARY.md): the site
  and its content
- [Agentic Delivery](./.claude/GLOSSARY.md): how agents build it

## Relationships

- **Agentic Delivery → all**: it changes the others
`;

const WEBSITE = `# Website

The personal site.

## Language

### Content

**Post**:
One dated entry in the Blog.
_Avoid_: Article, blog post

**Topic**:
One lesson of the DSA course.
_Avoid_: Article, post

**Standalone Page**:
A single piece of content.
_Avoid_: Page, which is ambiguous with Content Page
`;

const AGENTIC = `# Agentic Delivery

## Language

### Planning

**Approved Plan**:
The plan accepted at the Human Gate.
_Avoid_: spec, design

**Work Unit**:
A slice of the Approved Plan.
_Avoid_: task, slice, using it for a Wave (UI only)
`;

const glossaryOf = () => {
    const [website, agentic] = parseContextMap(MAP).entries;
    if (website === undefined || agentic === undefined) {
        throw new Error("the map fixture lists two contexts");
    }

    return {
        contexts: [parseContext(WEBSITE, website, []), parseContext(AGENTIC, agentic, [])],
        systemAdrs: [],
        relationships: parseContextMap(MAP).relationships,
    };
};

describe("glossary", () => {
    describe("parseContextMap", () => {
        test("reads each context's directory and joins its wrapped summary", async () => {
            const map = parseContextMap(MAP);

            expect(map.entries).toEqual([
                { name: "Website", dir: "apps/website", summary: "the site and its content" },
                { name: "Agentic Delivery", dir: ".claude", summary: "how agents build it" },
            ]);
            expect(map.relationships).toContain("Agentic Delivery → all");
        });
    });

    describe("parseContext", () => {
        test("reads terms with their section, definition and Avoid entry", async () => {
            const website = glossaryOf().contexts[0]!;

            expect(website.terms.map((term) => term.name)).toEqual(["Post", "Topic", "Standalone Page"]);
            expect(website.terms[0]).toEqual({
                name: "Post",
                section: "Content",
                definition: "One dated entry in the Blog.",
                avoid: "Article, blog post",
                avoidWords: ["Article", "blog post"],
            });
        });

        test("never flags a word that is a canonical term of the same context", async () => {
            const topic = glossaryOf().contexts[0]!.terms[1]!;

            expect(topic.avoidWords).toEqual(["Article"]);
        });
    });

    describe("avoidWordsOf", () => {
        test("drops guidance prose, clauses and parentheticals", async () => {
            const canonical = new Set<string>();

            expect(avoidWordsOf("Page, which is ambiguous with Content Page", canonical)).toEqual(["Page"]);
            expect(avoidWordsOf("frame, which is a render, not a Step", canonical)).toEqual(["frame"]);
            expect(avoidWordsOf('bare "store", view model', canonical)).toEqual(["view model"]);
            expect(avoidWordsOf("Oracle (UI copy only), bot", canonical)).toEqual(["Oracle", "bot"]);
            expect(avoidWordsOf("counting a Reveal as found", canonical)).toEqual([]);
        });
    });

    describe("check", () => {
        test("flags Avoid words in prose, naming the context and the canonical term", async () => {
            const flags = check("the implementer finished the task, now the articles", glossaryOf().contexts, "prompt");

            expect(flags).toEqual([
                { word: "Article", term: "Post", context: "Website", where: "prompt" },
                { word: "task", term: "Work Unit", context: "Agentic Delivery", where: "prompt" },
            ]);
        });

        test("ignores code, tags and link targets", async () => {
            const text = "Run the `task`, render <article>, see [notes](task.md)\n```\ntask\n```";

            expect(check(text, glossaryOf().contexts, "prompt")).toEqual([]);
        });

        test("ignores an Avoid word that is part of a canonical name", async () => {
            const flags = check("The Approved Plan said so", glossaryOf().contexts, "prompt");

            expect(flags).toEqual([]);
        });

        test("ignores a canonical name written with hyphens", async () => {
            const designSystem = parseContext(
                "# Design System\n\n## Language\n\n**Design System**:\nThe component library.\n",
                { name: "Design System", dir: "packages/design-system", summary: "the library" },
                [],
            );
            const contexts = [...glossaryOf().contexts, designSystem];

            expect(check("the design-system pieces", contexts, "prompt")).toEqual([]);
            expect(check("the design of the pieces", contexts, "prompt").map((flag) => flag.word)).toEqual(["design"]);
        });
    });

    describe("contextsForPath", () => {
        test("scopes an edit to the context that owns the path", async () => {
            const glossary = glossaryOf();

            expect(contextsForPath("apps/website/src/content/x/content.mdx", glossary)?.map((c) => c.name)).toEqual([
                "Website",
            ]);
            expect(contextsForPath("AGENTS.md", glossary)?.length).toBe(2);
            expect(contextsForPath("apps/website/src/page.tsx", glossary)).toBe(null);
            expect(contextsForPath(".claude/GLOSSARY.md", glossary)).toBe(null);
            expect(contextsForPath("GLOSSARY-MAP.md", glossary)).toBe(null);
        });
    });

    describe("elsewhere", () => {
        test("finds the contexts that avoid a term's name", async () => {
            const glossary = glossaryOf();
            const post = glossary.contexts[0]!.terms[0]!;

            expect(elsewhere(glossary, "Website", post)).toEqual([]);
            expect(elsewhere(glossary, "Website", { ...post, name: "Slice" })).toEqual([
                "Agentic Delivery avoids it for **Work Unit**",
            ]);
        });
    });

    describe("isOwnedPath", () => {
        test("is true only inside a context's directory", async () => {
            const glossary = glossaryOf();

            expect(isOwnedPath("apps/website/src/content/x/content.mdx", glossary)).toBe(true);
            expect(isOwnedPath(".claude/rules/testing.md", glossary)).toBe(true);
            expect(isOwnedPath("AGENTS.md", glossary)).toBe(false);
            expect(isOwnedPath("apps/websites/README.md", glossary)).toBe(false);
        });
    });

    describe("promptNote", () => {
        test("names each Avoid word with its context and canonical term", async () => {
            const flags = check("the task and the article", glossaryOf().contexts, "prompt");
            const note = promptNote(flags);

            expect(note).toContain("- 'Article' is an Avoid word in Website: when it means Post, say Post.");
            expect(note).toContain(
                "- 'task' is an Avoid word in Agentic Delivery: when it means Work Unit, say Work Unit.",
            );
            expect(note).toContain("If a word is meant in another sense, ignore its line.");
        });
    });

    describe("denyReason", () => {
        test("names the file, the context and the way through", async () => {
            const glossary = glossaryOf();
            const flags = check(
                "A new article",
                glossary.contexts.slice(0, 1),
                "apps/website/x.mdx",
                glossary.contexts,
            );
            const reason = denyReason(flags, "apps/website/x.mdx");

            expect(reason).toContain("this edit to apps/website/x.mdx uses Avoid words from the Website glossary");
            expect(reason).toContain("- 'Article' is an Avoid word in Website: when it means Post, say Post.");
            expect(reason).toContain("send the same edit again unchanged and it will pass");
        });
    });

    describe("singleContextEntry", () => {
        test("names a repository's only context after its GLOSSARY.md title, owning every path", async () => {
            const text =
                "# Ordering\n\nReceives and tracks customer orders.\n\n## Language\n\n**Order**:\nA purchase.\n_Avoid_: purchase\n";
            const entry = singleContextEntry(text);
            const context = parseContext(text, entry, []);
            const glossary = { contexts: [context], systemAdrs: [], relationships: "" };

            expect(entry).toEqual({ name: "Ordering", dir: "", summary: "Receives and tracks customer orders." });
            expect(isOwnedPath("docs/notes.md", glossary)).toBe(true);
            expect(contextsForPath("docs/notes.md", glossary)?.map((c) => c.name)).toEqual(["Ordering"]);
            expect(contextsForPath("GLOSSARY.md", glossary)).toBe(null);
        });
    });

    describe("search", () => {
        test("ranks name matches before definition matches", async () => {
            const labels = search(glossaryOf(), "plan").map((match) => match.label);

            expect(labels).toEqual(["Approved Plan · Agentic Delivery", "Work Unit · Agentic Delivery"]);
        });
    });
});
