import type { Adr, Flag, Glossary, GlossaryContext, Term } from "../types";

const PROSE_LEADS = /^(using|calling|counting|bare)\b/i;
const CLAUSE_LEAD = /^\s*(which|when|that)\b/i;

const untilClause = (parts: string[]): string[] => {
    const clause = parts.findIndex((part) => CLAUSE_LEAD.test(part));

    return clause < 0 ? parts : parts.slice(0, clause);
};

export const avoidWordsOf = (avoid: string, canonical: Set<string>): string[] =>
    untilClause(splitTopLevel(avoid))
        .map((entry) => entry.replace(/\([^)]*\)/g, "").trim())
        .filter((entry) => entry.length > 0 && !PROSE_LEADS.test(entry))
        .filter((entry) => /^[A-Za-z][A-Za-z -]*$/.test(entry) && entry.split(/\s+/).length <= 3)
        .filter((entry) => !canonical.has(entry.toLowerCase()));

const splitTopLevel = (text: string): string[] => {
    const parts: string[] = [];
    let depth = 0;
    let quoted = false;
    let current = "";
    for (const char of text) {
        if (char === "(") {
            depth += 1;
        } else if (char === ")") {
            depth = Math.max(0, depth - 1);
        } else if (char === '"') {
            quoted = !quoted;
        }
        if (char === "," && depth === 0 && !quoted) {
            parts.push(current);
            current = "";
        } else {
            current += char;
        }
    }
    parts.push(current);

    return parts;
};

export type MapEntry = { name: string; dir: string; summary: string };

export const parseContextMap = (text: string): { entries: MapEntry[]; relationships: string } => {
    const contexts = sectionOf(text, "Contexts");
    const entries: MapEntry[] = [];
    for (const bullet of contexts.split(/\n(?=- )/)) {
        const match = /^- \[([^\]]+)\]\(([^)]+)\):\s*([\s\S]*)$/.exec(bullet.trim());
        const [, name, link, summary] = match ?? [];
        if (name !== undefined && link !== undefined && summary !== undefined) {
            const dir = link.replace(/^\.\//, "").replace(/\/?CONTEXT\.md$/, "");
            entries.push({ name, dir, summary: summary.replace(/\s+/g, " ").trim() });
        }
    }

    return { entries, relationships: sectionOf(text, "Relationships").trim() };
};

const sectionOf = (text: string, heading: string): string => {
    const start = text.search(new RegExp(`^## ${heading}\\s*$`, "m"));
    if (start < 0) {
        return "";
    }
    const body = text.slice(start).replace(/^.*\n/, "");
    const end = body.search(/^## /m);

    return end < 0 ? body : body.slice(0, end);
};

export const parseContext = (text: string, entry: MapEntry, adrs: Adr[]): GlossaryContext => {
    const lines = text.split("\n");
    const terms: Term[] = [];
    const intro: string[] = [];
    let section = "";
    let current: Term | null = null;
    let isLanguage = false;
    for (const line of lines) {
        if (/^## /.test(line)) {
            isLanguage = /^## Language\s*$/.test(line);
            current = null;
        } else if (/^### /.test(line)) {
            section = line.replace(/^### /, "").trim();
            current = null;
        } else if (!isLanguage && terms.length === 0 && !/^# /.test(line) && line.trim() !== "") {
            intro.push(line);
        } else if (isLanguage) {
            const head = /^\*\*(.+?)\*\*:\s*(.*)$/.exec(line);
            if (head) {
                const term: Term = {
                    name: head[1] ?? "",
                    section,
                    definition: head[2] ?? "",
                    avoid: "",
                    avoidWords: [],
                };
                terms.push(term);
                current = term;
            } else if (current && /^_Avoid_:/.test(line)) {
                current.avoid = line.replace(/^_Avoid_:\s*/, "").trim();
            } else if (current && line.trim() !== "") {
                current.definition = `${current.definition} ${line.trim()}`.trim();
            } else if (line.trim() === "") {
                current = null;
            }
        }
    }
    const canonical = new Set(terms.map((term) => term.name.toLowerCase()));
    for (const term of terms) {
        term.avoidWords = avoidWordsOf(term.avoid, canonical);
    }

    return { name: entry.name, dir: entry.dir, summary: entry.summary, intro: intro.join("\n"), terms, adrs };
};

export const adrTitle = (path: string, text: string): Adr => {
    const heading = /^# (.+)$/m.exec(text);

    return { path, title: heading?.[1]?.trim() ?? path.split("/").pop() ?? path };
};

const proseOnly = (text: string): string =>
    text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`\n]*`/g, " ")
        .replace(/<[^>\n]+>/g, " ")
        .replace(/\]\([^)]*\)/g, "]")
        .replace(/https?:\/\/\S+/g, " ");

const escape = (word: string): string => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const canonicalNames = (contexts: GlossaryContext[]): string[] => {
    const names = contexts.flatMap((context) => [context.name, ...context.terms.map((term) => term.name)]);
    const tails = names
        .map((name) => name.split(/\s+/).slice(1))
        .filter((words) => words.length >= 2)
        .map((words) => words.join(" "));

    return [...new Set([...names, ...tails])].sort((a, b) => b.length - a.length);
};

const withoutCanonical = (prose: string, names: string[]): string =>
    names.reduce(
        (text, name) => text.replace(new RegExp(`\\b${escape(name).replace(/\s+/g, "\\s+")}s?\\b`, "gi"), " "),
        prose,
    );

export const check = (text: string, contexts: GlossaryContext[], where: string, all = contexts): Flag[] => {
    const prose = withoutCanonical(proseOnly(text), canonicalNames(all));
    const flags: Flag[] = [];
    const seen = new Set<string>();
    for (const context of contexts) {
        for (const term of context.terms) {
            for (const word of term.avoidWords) {
                const pattern = new RegExp(`\\b${escape(word).replace(/\s+/g, "\\s+")}(s|es)?\\b`, "i");
                const key = `${context.name}|${word.toLowerCase()}`;
                if (!seen.has(key) && pattern.test(prose)) {
                    seen.add(key);
                    flags.push({ word, term: term.name, context: context.name, where });
                }
            }
        }
    }

    return flags;
};

const EXEMPT = /(^|\/)(CONTEXT|CONTEXT-MAP)\.md$/;

export const contextsForPath = (relative: string, glossary: Glossary): GlossaryContext[] | null => {
    if (!/\.(md|mdx)$/.test(relative) || EXEMPT.test(relative)) {
        return null;
    }
    const owners = glossary.contexts
        .filter((context) => relative === context.dir || relative.startsWith(`${context.dir}/`))
        .sort((a, b) => b.dir.length - a.dir.length);

    return owners.length > 0 ? owners.slice(0, 1) : glossary.contexts;
};

export const isOwnedPath = (relative: string, glossary: Glossary): boolean =>
    glossary.contexts.some((context) => relative === context.dir || relative.startsWith(`${context.dir}/`));

const flagLine = (flag: Flag): string =>
    `- '${flag.word}' is an Avoid word in ${flag.context}: when it means ${flag.term}, say ${flag.term}.`;

export const promptNote = (flags: Flag[]): string =>
    [
        "Glossary Term Check: the prompt uses Avoid words from this repository's glossary (CONTEXT-MAP.md).",
        ...flags.map(flagLine),
        "Use the canonical terms in your reply and your work. If a word is meant in another sense, ignore its line.",
    ].join("\n");

export const denyReason = (flags: Flag[], relative: string): string =>
    [
        `Glossary Term Check: this edit to ${relative} uses Avoid words from the ${flags[0]?.context ?? ""} glossary.`,
        ...flags.map(flagLine),
        "Rewrite the text with the canonical terms. If a word is meant (a quote, code, another sense), " +
            "send the same edit again unchanged and it will pass.",
    ].join("\n");

export const elsewhere = (glossary: Glossary, contextName: string, term: Term): string[] => {
    const name = term.name.toLowerCase();
    const found: string[] = [];
    for (const context of glossary.contexts) {
        for (const other of context.terms) {
            const isSelf = context.name === contextName && other.name === term.name;
            if (isSelf) {
                continue;
            }
            if (other.name.toLowerCase() === name) {
                found.push(`**${other.name}** in ${context.name}: ${other.definition}`);
            } else if (other.avoidWords.some((word) => word.toLowerCase() === name)) {
                found.push(`${context.name} avoids it for **${other.name}**`);
            }
        }
    }

    return found;
};

export type Match = { id: string; label: string };

export const search = (glossary: Glossary, query: string): Match[] => {
    const needle = query.trim().toLowerCase();
    if (needle === "") {
        return [];
    }
    const byName: Match[] = [];
    const byText: Match[] = [];
    glossary.contexts.forEach((context, index) => {
        for (const term of context.terms) {
            const match = { id: termId(index, term.name), label: `${term.name} · ${context.name}` };
            if (term.name.toLowerCase().includes(needle)) {
                byName.push(match);
            } else if (`${term.definition} ${term.avoid}`.toLowerCase().includes(needle)) {
                byText.push(match);
            }
        }
    });
    const adrs = allAdrs(glossary)
        .filter((adr) => adr.title.toLowerCase().includes(needle))
        .map((adr) => ({ id: adrId(adr.path), label: `ADR · ${adr.title}` }));

    return [...byName, ...byText, ...adrs];
};

export const allAdrs = (glossary: Glossary): Adr[] => [
    ...glossary.systemAdrs,
    ...glossary.contexts.flatMap((context) => context.adrs),
];

export const termId = (contextIndex: number, name: string): string => `term:${contextIndex}:${name}`;
export const adrId = (path: string): string => `adr:${path}`;
export const contextId = (contextIndex: number): string => `ctx:${contextIndex}`;
export const RELATIONSHIPS_ID = "rel";
export const SYSTEM_ID = "system";

export const findTermId = (glossary: Glossary, name: string): string | null => {
    const needle = name.trim().toLowerCase();
    for (const [index, context] of glossary.contexts.entries()) {
        const term = context.terms.find((one) => one.name.toLowerCase() === needle);
        if (term) {
            return termId(index, term.name);
        }
    }
    const fuzzy = search(glossary, name)[0];

    return fuzzy ? fuzzy.id : null;
};

export const termMarkdown = (glossary: Glossary, contextIndex: number, term: Term): string => {
    const context = glossary.contexts[contextIndex];
    if (context === undefined) {
        return "";
    }
    const parts = [`## ${term.name}`, `_${context.name}${term.section ? ` · ${term.section}` : ""}_`, term.definition];
    if (term.avoid !== "") {
        parts.push(`**Avoid**: ${term.avoid}`);
        parts.push(
            term.avoidWords.length > 0
                ? `**Term Check flags**: ${term.avoidWords.map((word) => `\`${word}\``).join(", ")}`
                : "_The Term Check flags nothing for this term: its Avoid entries are guidance, not words._",
        );
    }
    const others = elsewhere(glossary, context.name, term);
    if (others.length > 0) {
        parts.push(`**Same word elsewhere**\n\n${others.map((line) => `- ${line}`).join("\n")}`);
    }

    return parts.join("\n\n");
};

export const contextMarkdown = (context: GlossaryContext): string => {
    const sections = [...new Set(context.terms.map((term) => term.section))].filter((one) => one !== "");
    const parts = [`## ${context.name}`, context.summary];
    if (context.intro.trim() !== "" && context.intro.trim() !== context.summary) {
        parts.push(context.intro.trim());
    }
    parts.push(`\`${context.dir}/CONTEXT.md\` · ${context.terms.length} terms · ${context.adrs.length} ADRs`);
    if (sections.length > 0) {
        parts.push(`**Sections**: ${sections.join(", ")}`);
    }

    return parts.join("\n\n");
};
