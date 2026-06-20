// @ts-check
"use strict";

/** @type {import("dependency-cruiser").IConfiguration} */
const config = {
    forbidden: [
        {
            name: "design-system-no-features",
            comment: [
                "ERROR-level enforcement: design-system components must not import from features/.",
                "All feature wiring (easter eggs, pwa, matrix-rain) must be injected at the feature level.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/design-system/",
            },
            to: {
                path: "^src/components/features/",
            },
        },
        {
            name: "features-import-only-via-index",
            comment: [
                "ERROR-level enforcement for features/: no direct .tsx imports from outside the folder.",
                "All features component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/features/.+\\.tsx$",
            },
        },
        {
            name: "features-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for features/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/features/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/features/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "import-only-via-index",
            comment: [
                "No module (except index barrels) may directly import a .tsx component file.",
                "All component imports must go through the folder's index.ts barrel.",
                "This ensures the component folder's encapsulation boundary is respected.",
            ].join(" "),
            severity: "warn",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/.+\\.tsx$",
            },
        },
        {
            name: "seal-private-nested-folders",
            comment: [
                "Nested private sub-folders (tier/section/component/sub/) are sealed.",
                "Only files inside the PARENT component folder may import from a nested sub-folder.",
                "Group $1 captures the parent component folder prefix from the FROM path.",
                "TO must be inside a 5-segment-deep path but NOT inside the same parent ($1).",
            ].join(" "),
            severity: "warn",
            from: {
                path: "^(src/components/[^/]+/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/[^/]+/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "content-page-isolation",
            comment: [
                "src/components/content/<pageA>/ must not import from src/components/content/<pageB>/.",
                "Group $1 = 'src/components/content/', $2 = the page folder name.",
                "TO must be in a content page folder but NOT the same page as FROM.",
            ].join(" "),
            severity: "warn",
            from: {
                path: "^(src/components/content/)([^/]+)/",
                pathNot: "^src/components/content/art/",
            },
            to: {
                path: "^$1[^/]+/",
                pathNot: "^$1$2/",
            },
        },
        {
            name: "content-art-page-isolation",
            comment: [
                "ERROR-level enforcement for content/art: must not import from any other content page.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/art/",
            },
            to: {
                path: "^src/components/content/[^/]+/",
                pathNot: "^src/components/content/art/",
            },
        },
        {
            name: "content-art-import-only-via-index",
            comment: [
                "ERROR-level enforcement for content/art: no direct .tsx imports from outside the folder.",
                "All content/art component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/art/",
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/content/art/.+\\.tsx$",
                pathNot: "^src/components/content/art/[^/]+/[^/]+\\.tsx$",
            },
        },
        {
            name: "content-art-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for content/art: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/content/art/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/content/art/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "design-system-layering",
            comment: [
                "Design-system layering: atoms must not import from molecules/organism/templates;",
                "molecules must not import from organism/templates; organism must not import from templates.",
                "This is a basic upward dependency check.",
            ].join(" "),
            severity: "warn",
            from: {
                path: "^src/components/design-system/(atoms)/",
            },
            to: {
                path: "^src/components/design-system/(molecules|organism|templates)/",
            },
        },
        {
            name: "no-circular",
            comment: "Circular dependencies are forbidden across all modules.",
            severity: "warn",
            from: {},
            to: {
                circular: true,
            },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
        },
        tsPreCompilationDeps: true,
        moduleSystems: ["es6", "cjs"],
        reporterOptions: {
            text: {
                highlightFocused: true,
            },
        },
    },
};

module.exports = config;
