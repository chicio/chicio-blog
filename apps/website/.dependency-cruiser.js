// @ts-check
"use strict";

/** @type {import("dependency-cruiser").IConfiguration} */
const config = {
    forbidden: [
        {
            name: "lib-no-components",
            comment:
                "lib/ is a pure logic leaf — it must not import from components/ or app/. Components consume lib/, never the reverse.",
            severity: "error",
            from: { path: "^src/lib/" },
            to: { path: "^src/(components|app)/" },
        },
        {
            name: "import-only-via-index",
            comment:
                "A component's internal .tsx may only be imported through its folder's index.ts barrel.",
            severity: "error",
            from: { pathNot: "/index\\.ts$" },
            to: { path: "^src/components/.+\\.tsx$" },
        },
        {
            name: "content-page-isolation",
            comment:
                "A content page (src/components/content/<page>/) must not import from another content page. Shared UI belongs in the design system or features/. Group $1 = 'src/components/content/', $2 = the page folder.",
            severity: "error",
            from: { path: "^(src/components/content/)([^/]+)/" },
            to: { path: "^$1[^/]+/", pathNot: "^$1$2/" },
        },
        {
            name: "no-circular",
            comment: "Circular dependencies are forbidden across all modules.",
            severity: "error",
            from: {},
            to: { circular: true },
        },
    ],
    options: {
        doNotFollow: { path: "node_modules" },
        exclude: {
            path: "(\\.(test|spec)\\.(ts|tsx)$|src/test-utils/)",
        },
        tsPreCompilationDeps: true,
        tsConfig: { fileName: "tsconfig.json" },
        moduleSystems: ["es6", "cjs"],
        reporterOptions: {
            text: { highlightFocused: true },
        },
    },
};

module.exports = config;
