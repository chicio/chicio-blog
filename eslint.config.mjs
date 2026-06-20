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

const eslintConfig = [
    ignores,
    ...coreWebVitals,
    ...typescript,
    componentStoreRules,
    storeHookRules,
    indexBarrelRules,
    featuresComponentStoreErrorRules,
    featuresStoreHookErrorRules,
    featuresIndexBarrelErrorRules,
    contentChatComponentStoreErrorRules,
    contentChatStoreHookErrorRules,
    contentChatIndexBarrelErrorRules,
];

export default eslintConfig;
