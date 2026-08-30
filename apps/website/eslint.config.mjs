import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const chicio = require("eslint-plugin-chicio");

const ignores = {
    ignores: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        ".claude/**",
        ".agents/**",
        // design-sync scaffolding for claude.ai/design: framework shims and preview cards, not app
        // code. The shims deliberately render <img> and destructure Next-only props to drop them,
        // and previews import the compiled bundle by package name — all of which trip app rules.
        ".design-sync/**",
        // generated .d.ts tree the design-sync converter reads (cfg.buildCmd emits it; gitignored)
        "dist/**",
        // design-sync build output: the compiled bundle and generated preview cards (gitignored)
        "ds-bundle/**",
        ".ds-sync/**",
        "public/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "e2e/**",
        "vitest.config.ts",
        "vitest.setup.ts",
        "playwright.config.ts",
        "src/test-utils/**",
    ],
};

const componentStoreRules = {
    files: ["src/components/**/*.tsx"],
    ignores: ["src/components/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const storeHookRules = {
    files: ["src/components/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const indexBarrelRules = {
    files: ["src/components/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

// These design-system components need a link or image implementation injected and fall back to a
// plain <a>/<img> without one: no client-side routing, no prefetching, no image optimisation — and
// every other gate stays green. The site must reach them through features/design-system-next/.
// dependency-cruiser cannot express this: with a single barrel it only sees the module, not which
// named export was imported.
const INJECTABLE = [
    "BrandHeader",
    "Breadcrumb",
    "CallToActionInternalWithTracking",
    "DropdownMenu",
    "Footer",
    "ImageCarousel",
    "ImageGlow",
    "InternalLink",
    "Menu",
    "MenuItem",
    "ProfileHero",
    "ProfilePhoto",
    "SocialContacts",
    "Tag",
    "TerminalButton",
    "BluePillLink",
    "RedPillLink",
];

const injectableViaBindings = {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/features/design-system-next/**"],
    rules: {
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    // Every published entry point, not just the root barrel: an injectable component
                    // moved behind a subpath would otherwise slip past this rule unnoticed.
                    ...["", "/chart", "/markdown", "/command-palette"].map((entry) => ({
                        name: `matrix-design-system${entry}`,
                        importNames: INJECTABLE,
                        message:
                            "This component needs next/link or next/image injected. Import it from @/components/features/design-system-next/ instead, or it silently renders a plain <a>/<img>.",
                    })),
                ],
            },
        ],
    },
};

const eslintConfig = [
    ignores,
    ...coreWebVitals,
    ...typescript,
    componentStoreRules,
    storeHookRules,
    indexBarrelRules,
    injectableViaBindings,
];

export default eslintConfig;
