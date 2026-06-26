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

const eslintConfig = [
    ignores,
    ...coreWebVitals,
    ...typescript,
    componentStoreRules,
    storeHookRules,
    indexBarrelRules,
];

export default eslintConfig;
