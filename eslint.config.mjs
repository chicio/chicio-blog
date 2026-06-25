import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const chicio = require("./tools/eslint/index.js");

const ignores = {
    ignores: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        ".claude/**",
        ".agents/**",
        "public/**",
        "tools/**",
    ],
};

const componentStoreRules = {
    files: ["src/components/**/*.tsx"],
    ignores: ["src/components/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["warn", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "warn",
        "chicio/folder-composition": "warn",
    },
};

const storeHookRules = {
    files: ["src/components/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "warn",
    },
};

const indexBarrelRules = {
    files: ["src/components/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "warn",
    },
};

const atomsComponentStoreErrorRules = {
    files: ["src/components/design-system/atoms/**/*.tsx"],
    ignores: ["src/components/design-system/atoms/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const atomsStoreHookErrorRules = {
    files: ["src/components/design-system/atoms/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const atomsIndexBarrelErrorRules = {
    files: ["src/components/design-system/atoms/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const featuresComponentStoreErrorRules = {
    files: ["src/components/features/**/*.tsx"],
    ignores: ["src/components/features/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const featuresStoreHookErrorRules = {
    files: ["src/components/features/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const featuresIndexBarrelErrorRules = {
    files: ["src/components/features/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const artComponentStoreErrorRules = {
    files: ["src/components/content/art/**/*.tsx"],
    ignores: ["src/components/content/art/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const artStoreHookErrorRules = {
    files: ["src/components/content/art/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const artIndexBarrelErrorRules = {
    files: ["src/components/content/art/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentChatComponentStoreErrorRules = {
    files: ["src/components/content/chat/**/*.tsx"],
    ignores: ["src/components/content/chat/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentChatStoreHookErrorRules = {
    files: ["src/components/content/chat/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentChatIndexBarrelErrorRules = {
    files: ["src/components/content/chat/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentBlogComponentStoreErrorRules = {
    files: ["src/components/content/blog/**/*.tsx"],
    ignores: ["src/components/content/blog/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentBlogStoreHookErrorRules = {
    files: ["src/components/content/blog/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentBlogIndexBarrelErrorRules = {
    files: ["src/components/content/blog/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentVideogamesComponentStoreErrorRules = {
    files: ["src/components/content/videogames/**/*.tsx"],
    ignores: ["src/components/content/videogames/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentVideogamesStoreHookErrorRules = {
    files: ["src/components/content/videogames/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentVideogamesIndexBarrelErrorRules = {
    files: ["src/components/content/videogames/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const moleculesComponentStoreErrorRules = {
    files: ["src/components/design-system/molecules/**/*.tsx"],
    ignores: ["src/components/design-system/molecules/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const moleculesStoreHookErrorRules = {
    files: ["src/components/design-system/molecules/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const moleculesIndexBarrelErrorRules = {
    files: ["src/components/design-system/molecules/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const organismComponentStoreErrorRules = {
    files: ["src/components/design-system/organism/**/*.tsx"],
    ignores: ["src/components/design-system/organism/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const organismStoreHookErrorRules = {
    files: ["src/components/design-system/organism/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const organismIndexBarrelErrorRules = {
    files: ["src/components/design-system/organism/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const templatesComponentStoreErrorRules = {
    files: ["src/components/design-system/templates/**/*.tsx"],
    ignores: ["src/components/design-system/templates/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const templatesStoreHookErrorRules = {
    files: ["src/components/design-system/templates/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const templatesIndexBarrelErrorRules = {
    files: ["src/components/design-system/templates/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentAboutMeComponentStoreErrorRules = {
    files: ["src/components/content/about-me/**/*.tsx"],
    ignores: ["src/components/content/about-me/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentAboutMeStoreHookErrorRules = {
    files: ["src/components/content/about-me/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentAboutMeIndexBarrelErrorRules = {
    files: ["src/components/content/about-me/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentMcpComponentStoreErrorRules = {
    files: ["src/components/content/mcp/**/*.tsx"],
    ignores: ["src/components/content/mcp/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentMcpStoreHookErrorRules = {
    files: ["src/components/content/mcp/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentMcpIndexBarrelErrorRules = {
    files: ["src/components/content/mcp/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentHomeComponentStoreErrorRules = {
    files: ["src/components/content/home/**/*.tsx"],
    ignores: ["src/components/content/home/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentHomeStoreHookErrorRules = {
    files: ["src/components/content/home/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentHomeIndexBarrelErrorRules = {
    files: ["src/components/content/home/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentClownsComponentStoreErrorRules = {
    files: ["src/components/content/clowns/**/*.tsx"],
    ignores: ["src/components/content/clowns/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentClownsStoreHookErrorRules = {
    files: ["src/components/content/clowns/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentClownsIndexBarrelErrorRules = {
    files: ["src/components/content/clowns/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentContactComponentStoreErrorRules = {
    files: ["src/components/content/contact/**/*.tsx"],
    ignores: ["src/components/content/contact/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentContactStoreHookErrorRules = {
    files: ["src/components/content/contact/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentContactIndexBarrelErrorRules = {
    files: ["src/components/content/contact/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const contentDsaComponentStoreErrorRules = {
    files: ["src/components/content/data-structures-and-algorithms/**/*.tsx"],
    ignores: ["src/components/content/data-structures-and-algorithms/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const contentDsaStoreHookErrorRules = {
    files: ["src/components/content/data-structures-and-algorithms/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const contentDsaIndexBarrelErrorRules = {
    files: ["src/components/content/data-structures-and-algorithms/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const eslintConfig = [
    ignores,
    ...coreWebVitals,
    ...typescript,
    componentStoreRules,
    storeHookRules,
    indexBarrelRules,
    atomsComponentStoreErrorRules,
    atomsStoreHookErrorRules,
    atomsIndexBarrelErrorRules,
    moleculesComponentStoreErrorRules,
    moleculesStoreHookErrorRules,
    moleculesIndexBarrelErrorRules,
    organismComponentStoreErrorRules,
    organismStoreHookErrorRules,
    organismIndexBarrelErrorRules,
    templatesComponentStoreErrorRules,
    templatesStoreHookErrorRules,
    templatesIndexBarrelErrorRules,
    featuresComponentStoreErrorRules,
    featuresStoreHookErrorRules,
    featuresIndexBarrelErrorRules,
    artComponentStoreErrorRules,
    artStoreHookErrorRules,
    artIndexBarrelErrorRules,
    contentChatComponentStoreErrorRules,
    contentChatStoreHookErrorRules,
    contentChatIndexBarrelErrorRules,
    contentBlogComponentStoreErrorRules,
    contentBlogStoreHookErrorRules,
    contentBlogIndexBarrelErrorRules,
    contentVideogamesComponentStoreErrorRules,
    contentVideogamesStoreHookErrorRules,
    contentVideogamesIndexBarrelErrorRules,
    contentAboutMeComponentStoreErrorRules,
    contentAboutMeStoreHookErrorRules,
    contentAboutMeIndexBarrelErrorRules,
    contentMcpComponentStoreErrorRules,
    contentMcpStoreHookErrorRules,
    contentMcpIndexBarrelErrorRules,
    contentHomeComponentStoreErrorRules,
    contentHomeStoreHookErrorRules,
    contentHomeIndexBarrelErrorRules,
    contentClownsComponentStoreErrorRules,
    contentClownsStoreHookErrorRules,
    contentClownsIndexBarrelErrorRules,
    contentContactComponentStoreErrorRules,
    contentContactStoreHookErrorRules,
    contentContactIndexBarrelErrorRules,
    contentDsaComponentStoreErrorRules,
    contentDsaStoreHookErrorRules,
    contentDsaIndexBarrelErrorRules,
];

export default eslintConfig;
