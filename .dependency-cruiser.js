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
            name: "atoms-import-only-via-index",
            comment: [
                "ERROR-level enforcement for design-system/atoms/: no direct .tsx imports from outside the folder.",
                "All atoms component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/design-system/atoms/.+\\.tsx$",
            },
        },
        {
            name: "atoms-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for design-system/atoms/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/design-system/atoms/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/design-system/atoms/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
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
            name: "content-chat-import-only-via-index",
            comment: [
                "ERROR-level enforcement for content/chat/: no direct .tsx imports from outside the folder.",
                "All content/chat component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/content/chat/.+\\.tsx$",
            },
        },
        {
            name: "content-chat-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for content/chat/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/content/chat/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/content/chat/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "content-chat-page-isolation",
            comment: [
                "ERROR-level enforcement: content/chat/ must not import from other content pages.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/chat/",
            },
            to: {
                path: "^src/components/content/",
                pathNot: "^src/components/content/chat/",
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
                pathNot: [
                    "^src/components/content/art/",
                    "^src/components/content/blog/",
                    "^src/components/content/videogames/",
                ],
            },
            to: {
                path: "^$1[^/]+/",
                pathNot: "^$1$2/",
            },
        },
        {
            name: "content-blog-page-isolation",
            comment: [
                "ERROR-level enforcement: content/blog/ must not import from any other content page.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/blog/",
            },
            to: {
                path: "^src/components/content/[^/]+/",
                pathNot: "^src/components/content/blog/",
            },
        },
        {
            name: "content-blog-import-only-via-index",
            comment: [
                "ERROR-level enforcement for content/blog: no direct .tsx imports from outside the folder.",
                "All content/blog component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/blog/",
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/content/blog/.+\\.tsx$",
                pathNot: "^src/components/content/blog/[^/]+/[^/]+\\.tsx$",
            },
        },
        {
            name: "content-blog-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for content/blog: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/content/blog/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/content/blog/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
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
            name: "content-videogames-page-isolation",
            comment: [
                "ERROR-level enforcement: content/videogames/ must not import from any other content page.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/videogames/",
            },
            to: {
                path: "^src/components/content/[^/]+/",
                pathNot: "^src/components/content/videogames/",
            },
        },
        {
            name: "content-videogames-import-only-via-index",
            comment: [
                "ERROR-level enforcement for content/videogames: no direct .tsx imports from outside the folder.",
                "All content/videogames component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/content/videogames/",
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/content/videogames/.+\\.tsx$",
                pathNot: "^src/components/content/videogames/[^/]+/[^/]+\\.tsx$",
            },
        },
        {
            name: "content-videogames-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for content/videogames: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/content/videogames/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/content/videogames/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "molecules-import-only-via-index",
            comment: [
                "ERROR-level enforcement for design-system/molecules/: no direct .tsx imports from outside the folder.",
                "All molecules component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/design-system/molecules/.+\\.tsx$",
            },
        },
        {
            name: "molecules-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for design-system/molecules/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/design-system/molecules/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/design-system/molecules/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "organism-import-only-via-index",
            comment: [
                "ERROR-level enforcement for design-system/organism/: no direct .tsx imports from outside the folder.",
                "All organism component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/design-system/organism/.+\\.tsx$",
            },
        },
        {
            name: "organism-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for design-system/organism/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/design-system/organism/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/design-system/organism/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "templates-import-only-via-index",
            comment: [
                "ERROR-level enforcement for design-system/templates/: no direct .tsx imports from outside the folder.",
                "All templates component imports must go through the folder's index.ts barrel.",
            ].join(" "),
            severity: "error",
            from: {
                pathNot: "/index\\.ts$",
            },
            to: {
                path: "^src/components/design-system/templates/.+\\.tsx$",
            },
        },
        {
            name: "templates-seal-private-nested-folders",
            comment: [
                "ERROR-level enforcement for design-system/templates/: nested sub-folders are sealed.",
                "Only the parent component folder may import from its nested sub-folder.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^(src/components/design-system/templates/[^/]+/[^/]+)/",
            },
            to: {
                path: "^src/components/design-system/templates/[^/]+/[^/]+/[^/]+/",
                pathNot: "^$1/",
            },
        },
        {
            name: "design-system-layering-atoms",
            comment: [
                "ERROR-level enforcement: atoms must not import from molecules/organism/templates.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/design-system/atoms/",
            },
            to: {
                path: "^src/components/design-system/(molecules|organism|templates)/",
            },
        },
        {
            name: "design-system-layering-molecules",
            comment: [
                "ERROR-level enforcement: molecules must not import from organism/templates.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/design-system/molecules/",
            },
            to: {
                path: "^src/components/design-system/(organism|templates)/",
            },
        },
        {
            name: "design-system-layering",
            comment: [
                "ERROR-level enforcement: organism must not import from templates.",
                "Design-system layering enforced at error level now that organism tier is migrated.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/design-system/(organism)/",
            },
            to: {
                path: "^src/components/design-system/(templates)/",
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
