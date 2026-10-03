export type Term = {
    name: string;
    section: string;
    definition: string;
    avoid: string;
    avoidWords: string[];
};

export type Adr = {
    path: string;
    title: string;
};

export type GlossaryContext = {
    name: string;
    dir: string;
    summary: string;
    intro: string;
    terms: Term[];
    adrs: Adr[];
};

export type Glossary = {
    contexts: GlossaryContext[];
    systemAdrs: Adr[];
    relationships: string;
};

export type Flag = {
    word: string;
    term: string;
    context: string;
    where: string;
};

declare module "claude-code" {
    interface PluginState {
        "glossary-browser": {
            glossary: Glossary | null;
            selected: string | null;
            expanded: string | null;
            filter: string;
            page: number;
            flags: Flag[];
        };
    }
}
