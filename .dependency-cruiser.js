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
            name: "design-system-no-next",
            comment:
                "Design-system must not import from next. It is framework-agnostic: a consumer injects its own link and image implementations (see AnchorLink / PlainImage), and the site's Next bindings live in src/components/features/design-system-next/.",
            severity: "error",
            from: { path: "^src/components/design-system/" },
            to: { path: "^node_modules/next/" },
        },
        {
            name: "injectable-design-system-via-bindings",
            comment:
                "These design-system components need a link or image implementation injected, and silently fall back to a plain <a>/<img> without one — no client-side routing, no prefetching, no image optimisation, and every gate still green. Import them from src/components/features/design-system-next/ instead, which binds next/link and next/image.",
            severity: "error",
            from: {
                path: "^src/(app|components/(content|features))/",
                pathNot: "^src/components/features/design-system-next/",
            },
            to: {
                path: "^src/components/design-system/(atoms/(links/internal-link|call-to-actions/call-to-action-internal-with-tracking|effects/image-glow)|molecules/(menu/(menu-item|dropdown-menu)|buttons/(tag|terminal-button)|links/pills-links|breadcrumbs/breadcrumb)|organism/(menu|footer|social-contacts|header/brand-header|image-carousel|profile-photo))/",
            },
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
            comment: "Atoms must not import from molecules/organism.",
            severity: "error",
            from: { path: "^src/components/design-system/atoms/" },
            to: { path: "^src/components/design-system/(molecules|organism)/" },
        },
        {
            name: "design-system-layering-molecules",
            comment: "Molecules must not import from organism.",
            severity: "error",
            from: { path: "^src/components/design-system/molecules/" },
            to: { path: "^src/components/design-system/organism/" },
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
