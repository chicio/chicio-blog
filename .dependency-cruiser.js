// @ts-check
"use strict";

/** @type {import("dependency-cruiser").IConfiguration} */
const config = {
    forbidden: [
        {
            name: "design-system-no-features",
            comment:
                "Design-system must not import from features/. Feature behaviour (easter eggs, pwa, matrix-rain panel, tracking) is injected at the feature/app layer via props.",
            severity: "error",
            from: { path: "^src/components/design-system/" },
            to: { path: "^src/components/features/" },
        },
        {
            name: "design-system-no-lib",
            comment:
                "Design-system must not import runtime values from lib/. Business logic is injected from the feature/content/app layer; only type-only @/types is allowed (see design-system-types-type-only).",
            severity: "error",
            from: { path: "^src/components/design-system/" },
            to: { path: "^src/lib/" },
        },
        {
            name: "design-system-types-type-only",
            comment:
                "Inside design-system, imports from src/types/ must be type-only (import type {...}). Runtime value imports (slugs, siteMetadata, tracking, ...) are forbidden — inject them as props from the app/features layer.",
            severity: "error",
            from: { path: "^src/components/design-system/" },
            to: { path: "^src/types/", dependencyTypesNot: ["type-only"] },
        },
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
                "A component's internal .tsx may only be imported through its folder's index.ts barrel. The flat shared-hooks home (design-system/hooks/) is exempt — its hooks are imported directly, without barrels.",
            severity: "error",
            from: { pathNot: "/index\\.ts$" },
            to: {
                path: "^src/components/.+\\.tsx$",
                pathNot: "^src/components/design-system/hooks/",
            },
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
            name: "design-system-layering-atoms",
            comment: "Atoms must not import from molecules/organism/templates.",
            severity: "error",
            from: { path: "^src/components/design-system/atoms/" },
            to: { path: "^src/components/design-system/(molecules|organism|templates)/" },
        },
        {
            name: "design-system-layering-molecules",
            comment: "Molecules must not import from organism/templates.",
            severity: "error",
            from: { path: "^src/components/design-system/molecules/" },
            to: { path: "^src/components/design-system/(organism|templates)/" },
        },
        {
            name: "design-system-layering-organism",
            comment: "Organism must not import from templates.",
            severity: "error",
            from: { path: "^src/components/design-system/organism/" },
            to: { path: "^src/components/design-system/templates/" },
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
        tsPreCompilationDeps: true,
        tsConfig: { fileName: "tsconfig.json" },
        moduleSystems: ["es6", "cjs"],
        reporterOptions: {
            text: { highlightFocused: true },
        },
    },
};

module.exports = config;
