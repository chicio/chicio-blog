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
];

export default eslintConfig;
