import { atom, read, update } from "claude-code";
import type { EngineInterface, Register } from "claude-code";

import type { Adr, Flag, Glossary } from "../types";
import {
    RELATIONSHIPS_ID,
    SYSTEM_ID,
    adrId,
    adrTitle,
    allAdrs,
    check,
    contextId,
    contextMarkdown,
    contextsForPath,
    findTermId,
    parseContext,
    parseContextMap,
    search,
    termId,
    termMarkdown,
} from "./glossary";

const PLUGIN = "glossary-browser";
const PANE = "glossary-browser";
const TITLE = "Glossary Browser";
const LIST_WIDTH = 34;
const MARKDOWN_LIMIT = 9800;
const BAND_FLAGS = 3;

const glossaryAtom = atom({ plugin: "glossary-browser", key: "glossary" } as const, null);
const selectedAtom = atom({ plugin: "glossary-browser", key: "selected" } as const, null);
const expandedAtom = atom({ plugin: "glossary-browser", key: "expanded" } as const, null);
const filterAtom = atom({ plugin: "glossary-browser", key: "filter" } as const, "");
const pageAtom = atom({ plugin: "glossary-browser", key: "page" } as const, 0);
const flagsAtom = atom({ plugin: "glossary-browser", key: "flags" } as const, []);

type Engine = EngineInterface;

const listAdrs = async ($: Engine, root: string, dir: string): Promise<Adr[]> => {
    const relative = dir === "" ? "docs/adr" : `${dir}/docs/adr`;
    if (!(await $.fs.exists(`${root}/${relative}`))) {
        return [];
    }
    const entries = await $.fs.list(`${root}/${relative}`);
    const files = entries
        .filter((entry) => entry.kind === "file" && entry.name.endsWith(".md"))
        .map((entry) => entry.name)
        .sort();

    return Promise.all(
        files.map(async (name) => adrTitle(`${relative}/${name}`, await $.fs.read(`${root}/${relative}/${name}`))),
    );
};

const loadGlossary = async ($: Engine): Promise<Glossary | null> => {
    const root = await $.session.root();
    if (!(await $.fs.exists(`${root}/CONTEXT-MAP.md`))) {
        return null;
    }
    const map = parseContextMap(await $.fs.read(`${root}/CONTEXT-MAP.md`));
    const contexts = await Promise.all(
        map.entries.map(async (entry) => {
            const path = `${root}/${entry.dir}/CONTEXT.md`;
            const text = (await $.fs.exists(path)) ? await $.fs.read(path) : "";

            return parseContext(text, entry, await listAdrs($, root, entry.dir));
        }),
    );

    return { contexts, systemAdrs: await listAdrs($, root, ""), relationships: map.relationships };
};

const refresh = async ($: Engine): Promise<Glossary | null> => {
    const glossary = await loadGlossary($).catch((error: unknown) => {
        $.ui.log(`${PLUGIN}: could not read the glossary (${String(error)})`, { to: "debug" });

        return null;
    });
    await update($, glossaryAtom, () => glossary);

    return glossary;
};

const openPane = async ($: Engine) => {
    await refresh($);
    const opened = await $.ui.open({ id: PANE, title: TITLE, focus: true, closeOnEscape: true });
    if (!opened.isPlaced) {
        $.ui.toast(`${TITLE}: widen the terminal to see it`);
    }
};

const select = async ($: Engine, id: string) => {
    await update($, selectedAtom, () => id);
};

const truncate = (text: string): string =>
    text.length <= MARKDOWN_LIMIT ? text : `${text.slice(0, MARKDOWN_LIMIT)}\n\n_…truncated_`;

const detailOf = async ($: Engine, glossary: Glossary, id: string | null): Promise<string> => {
    if (id === null) {
        return [
            `## ${TITLE}`,
            "The project's ubiquitous language, read live from `CONTEXT-MAP.md` and each context's `CONTEXT.md`.",
            "Pick a context on the left, or type in the filter to search every term, definition and ADR.",
            "The **Term Check** flags _Avoid_ words in your prompts and in the model's edits to Markdown files; " +
                "its flags show in the band above the prompt.",
        ].join("\n\n");
    }
    if (id === RELATIONSHIPS_ID) {
        return `## Relationships\n\n${glossary.relationships}`;
    }
    if (id.startsWith("ctx:")) {
        const context = glossary.contexts[Number(id.slice(4))];

        return context ? contextMarkdown(context) : "";
    }
    if (id.startsWith("term:")) {
        const [, index, ...name] = id.split(":");
        const contextIndex = Number(index);
        const term = glossary.contexts[contextIndex]?.terms.find((one) => one.name === name.join(":"));

        return term ? termMarkdown(glossary, contextIndex, term) : "";
    }
    if (id.startsWith("adr:")) {
        const root = await $.session.root();
        const path = id.slice(4);
        const text = await $.fs.read(`${root}/${path}`).catch(() => `_Could not read \`${path}\`._`);

        return truncate(`_\`${path}\`_\n\n${text}`);
    }

    return "";
};

type Row = { kind: "label"; text: string } | { kind: "item"; id: string; text: string };

const rowsOf = (glossary: Glossary, expanded: string | null, filter: string): Row[] => {
    if (filter.trim() !== "") {
        const matches = search(glossary, filter);

        return matches.length === 0
            ? [{ kind: "label", text: "No match." }]
            : matches.map((match) => ({ kind: "item", id: match.id, text: match.label }));
    }
    const rows: Row[] = [];
    glossary.contexts.forEach((context, index) => {
        const id = contextId(index);
        const isOpen = expanded === id;
        rows.push({ kind: "item", id, text: `${isOpen ? "▾" : "▸"} ${context.name} (${context.terms.length})` });
        if (isOpen) {
            let section = "";
            for (const term of context.terms) {
                if (term.section !== section && term.section !== "") {
                    section = term.section;
                    rows.push({ kind: "label", text: `  ${section}` });
                }
                rows.push({ kind: "item", id: termId(index, term.name), text: `    ${term.name}` });
            }
            if (context.adrs.length > 0) {
                rows.push({ kind: "label", text: "  ADRs" });
                for (const adr of context.adrs) {
                    rows.push({ kind: "item", id: adrId(adr.path), text: `    ${adr.title}` });
                }
            }
        }
    });
    const isSystemOpen = expanded === SYSTEM_ID;
    rows.push({
        kind: "item",
        id: SYSTEM_ID,
        text: `${isSystemOpen ? "▾" : "▸"} System-wide ADRs (${glossary.systemAdrs.length})`,
    });
    if (isSystemOpen) {
        for (const adr of glossary.systemAdrs) {
            rows.push({ kind: "item", id: adrId(adr.path), text: `    ${adr.title}` });
        }
    }
    rows.push({ kind: "item", id: RELATIONSHIPS_ID, text: "• Relationships" });

    return rows;
};

const isGroup = (id: string): boolean => id.startsWith("ctx:") || id === SYSTEM_ID;

const describeFlags = (flags: Flag[]): string => flags.map((flag) => `'${flag.word}' → ${flag.term}`).join(" · ");

export const register: Register = (on) => {
    on("session.start", async ($, e, next) => {
        await $.command.register({
            name: "glossary",
            description: "Open the Glossary Browser, optionally on a term: /glossary [term]",
        });
        await refresh($);

        return next(e);
    });

    on("command.run", { command: "glossary" }, async ($, e) => {
        const glossary = await refresh($);
        if (glossary === null) {
            return { text: "No CONTEXT-MAP.md in this project: nothing to browse." };
        }
        const query = e.args.trim();
        if (query !== "") {
            const id = findTermId(glossary, query);
            if (id !== null) {
                await select($, id);
                const contextIndex = id.startsWith("term:") ? id.split(":")[1] : null;
                if (contextIndex !== null) {
                    await update($, expandedAtom, () => contextId(Number(contextIndex)));
                }
                await update($, filterAtom, () => "");
            } else {
                await update($, filterAtom, () => query);
            }
        }
        await openPane($);

        return { text: `${TITLE} opened${query !== "" ? ` on "${query}"` : ""}.` };
    });

    on("prompt.submit", async ($, e, next) => {
        const glossary = await read($, glossaryAtom);
        if (glossary !== null && !e.text.trimStart().startsWith("/")) {
            await update($, flagsAtom, () => check(e.text, glossary.contexts, "prompt"));
        }

        return next(e);
    });

    on("tool.call", async ($, e, next) => {
        const ran = await next(e);
        const isEdit = e.tool === "Edit" || e.tool === "Write";
        if (!isEdit || ran.deny !== undefined || ran.isError === true) {
            return ran;
        }
        const input = e as unknown as { file_path: string; new_string?: string; content?: string };
        const root = await $.session.root();
        if (!input.file_path.startsWith(`${root}/`)) {
            return ran;
        }
        const relative = input.file_path.slice(root.length + 1);
        if (/(^|\/)(CONTEXT|CONTEXT-MAP)\.md$|(^|\/)docs\/adr\//.test(relative)) {
            await refresh($);
        }
        const glossary = await read($, glossaryAtom);
        const contexts = glossary === null ? null : contextsForPath(relative, glossary);
        if (glossary === null || contexts === null) {
            return ran;
        }
        const text = (e.tool === "Edit" ? input.new_string : input.content) ?? "";
        const found = check(text, contexts, relative, glossary.contexts);
        if (found.length > 0) {
            await update($, flagsAtom, (flags) => {
                const known = new Set(flags.map((flag) => `${flag.context}|${flag.word}|${flag.where}`));

                return [...flags, ...found.filter((flag) => !known.has(`${flag.context}|${flag.word}|${flag.where}`))];
            });
        }

        return ran;
    });

    on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
        const glossary = await read($, glossaryAtom);
        if (e.props.hasSurvey || glossary === null) {
            return next(e);
        }
        const { Box, Button, Text } = $.ui.resolve(e);
        const flags = await read($, flagsAtom);
        const terms = glossary.contexts.reduce((sum, context) => sum + context.terms.length, 0);
        const adrs = allAdrs(glossary).length;
        const openOn = (flag: Flag) => async () => {
            const index = glossary.contexts.findIndex((context) => context.name === flag.context);
            await select($, termId(index, flag.term));
            await update($, expandedAtom, () => contextId(index));
            await update($, filterAtom, () => "");
            await openPane($);
        };

        return (
            <Box flexDirection="column">
                <Box gap={1}>
                    <Button key="open" label="Glossary" hotkey="g" onPress={() => openPane($)} />
                    <Text dimColor wrap="truncate">
                        {glossary.contexts.map((context) => context.name).join(" · ")} — {terms} terms · {adrs} ADRs
                    </Text>
                </Box>
                {flags.length > 0 && (
                    <Box gap={1}>
                        <Text color="yellow">⚠ Term Check</Text>
                        {flags.slice(0, BAND_FLAGS).map((flag, index) => (
                            <Button
                                key={`flag-${index}`}
                                label={`'${flag.word}' → ${flag.term}`}
                                hotkey={String(index + 1)}
                                plain
                                onPress={openOn(flag)}
                            />
                        ))}
                        {flags.length > BAND_FLAGS && <Text dimColor>+{flags.length - BAND_FLAGS} more</Text>}
                        <Button
                            key="clear"
                            label="clear"
                            hotkey="x"
                            plain
                            dimColor
                            onPress={() => update($, flagsAtom, () => [])}
                        />
                    </Box>
                )}
            </Box>
        );
    });

    on("ui.render", { component: "Pane", requestId: PANE }, async ($, e) => {
        const elements = $.ui.resolve(e);
        const { Box, Button, Markdown, Text } = elements;
        const Input = "Input" in elements ? elements.Input : null;
        const glossary = await read($, glossaryAtom);
        if (glossary === null) {
            return <Text dimColor>No CONTEXT-MAP.md in this project.</Text>;
        }
        const selected = await read($, selectedAtom);
        const expanded = await read($, expandedAtom);
        const filter = await read($, filterAtom);
        const flags = await read($, flagsAtom);
        const rows = rowsOf(glossary, expanded, filter);
        const room = Math.max(4, (e.viewport?.rows ?? 24) - 4);
        const pages = Math.max(1, Math.ceil(rows.length / room));
        const page = Math.min(await read($, pageAtom), pages - 1);
        const visible = rows.slice(page * room, page * room + room);
        const detail = await detailOf($, glossary, selected);
        const press = (id: string) => async () => {
            if (isGroup(id)) {
                await update($, expandedAtom, (current) => (current === id ? null : id));
                await update($, pageAtom, () => 0);
            }
            await select($, id);
        };
        const flagNote = flags.length > 0 ? `\n\n---\n\n**Term Check**: ${describeFlags(flags)}` : "";

        return (
            <Box flexDirection="row" gap={2}>
                <Box flexDirection="column" width={LIST_WIDTH} flexShrink={0}>
                    {Input !== null && (
                        <Input
                            key="filter"
                            placeholder="filter terms and ADRs"
                            value={filter}
                            submitLabel="open"
                            onInput={(value: string) =>
                                update($, filterAtom, () => value).then(() => update($, pageAtom, () => 0))
                            }
                            onSubmit={(value: string) => {
                                const first = search(glossary, value)[0];
                                return first ? select($, first.id) : undefined;
                            }}
                        />
                    )}
                    {visible.map((row, index) =>
                        row.kind === "label" ? (
                            <Text key={`label-${page}-${index}`} dimColor wrap="truncate">
                                {row.text}
                            </Text>
                        ) : (
                            <Button
                                key={row.id}
                                label={`${row.id === selected ? "›" : " "}${row.text}`}
                                plain
                                dimColor={row.id !== selected}
                                onPress={press(row.id)}
                            />
                        ),
                    )}
                    {pages > 1 && (
                        <Box gap={1}>
                            {page > 0 && (
                                <Button
                                    key="prev"
                                    label="▲ prev"
                                    plain
                                    onPress={() => update($, pageAtom, () => page - 1)}
                                />
                            )}
                            <Text dimColor>
                                {page + 1}/{pages}
                            </Text>
                            {page < pages - 1 && (
                                <Button
                                    key="next"
                                    label="▼ next"
                                    plain
                                    onPress={() => update($, pageAtom, () => page + 1)}
                                />
                            )}
                        </Box>
                    )}
                </Box>
                <Box flexDirection="column" flexGrow={1}>
                    <Markdown key="detail" text={truncate(`${detail}${flagNote}`)} />
                </Box>
            </Box>
        );
    });
};
