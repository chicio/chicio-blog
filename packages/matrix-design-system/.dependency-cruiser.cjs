// @ts-check
"use strict";

/** @type {import("dependency-cruiser").IConfiguration} */
const config = {
    forbidden: [
        {
            name: "no-next",
            comment:
                "The design system is framework-agnostic: it must not import from next. A consumer injects its own link and image implementations (see AnchorLink / PlainImage).",
            severity: "error",
            from: {},
            to: { path: "node_modules/next/" },
        },
        {
            name: "root-barrel-no-optional-peers",
            comment:
                "Nothing reachable from the root barrel may need an optional peer dependency. Those libraries are optional precisely because charts, markdown and the command palette live behind their own entry points (matrix-design-system/chart, /markdown, /command-palette); re-exporting one of them from src/index.ts makes `import { Button }` fail to resolve for every consumer who did not install it. Type-only imports count: a recharts type in the published .d.mts breaks a consumer's typecheck just as hard. Move the export to the matching entry file instead.",
            severity: "error",
            from: { path: "^src/index\\.ts$" },
            to: {
                path: "node_modules/(recharts|cmdk|react-markdown|rehype-[a-z]+|remark-[a-z]+|unified)/",
                reachable: true,
            },
        },
        {
            name: "layering-atoms",
            comment: "Atoms must not import from molecules or organism.",
            severity: "error",
            from: { path: "^src/atoms/" },
            to: { path: "^src/(molecules|organism)/" },
        },
        {
            name: "layering-molecules",
            comment: "Molecules must not import from organism.",
            severity: "error",
            from: { path: "^src/molecules/" },
            to: { path: "^src/organism/" },
        },
        {
            name: "import-only-via-index",
            comment:
                "A component's internal .tsx may only be imported through its folder's index.ts barrel. The flat shared-hooks home (src/hooks/) is exempt.",
            severity: "error",
            from: { pathNot: "/index\\.ts$" },
            to: { path: "^src/.+\\.tsx$", pathNot: "^src/(hooks|test-utils)/" },
        },
        {
            name: "no-circular",
            comment: "Circular dependencies are forbidden.",
            severity: "error",
            from: {},
            to: { circular: true },
        },
    ],
    options: {
        doNotFollow: { path: "node_modules" },
        exclude: { path: "(\\.(test|spec)\\.(ts|tsx)$|src/test-utils/)" },
        tsPreCompilationDeps: true,
        tsConfig: { fileName: "tsconfig.json" },
        moduleSystems: ["es6", "cjs"],
    },
};

module.exports = config;
