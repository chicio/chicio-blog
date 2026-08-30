import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const chicio = require("eslint-plugin-chicio");

/**
 * The design system is framework-agnostic, so it is deliberately NOT held to eslint-config-next:
 * rendering a real <img> in PlainImage is the documented fallback, not a mistake.
 */
export default [
    // .design-sync/ and .ds-sync/ are the Claude Design converter: staged third-party scripts and
// generated previews, none of it this package's source.
    { ignores: ["dist/**", "node_modules/**", ".design-sync/**", ".ds-sync/**", "ds-bundle/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.es2021 },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { react, "react-hooks": reactHooks },
        settings: { react: { version: "detect" } },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            // `_`-prefixed parameters are how framework-only props are kept off the DOM, where
            // React would warn about unknown attributes.
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
            ],
        },
    },
    {
        files: ["src/**/*.tsx"],
        // Stories document the components; they are not components. folder-composition would
        // reject every *.stories.tsx for not matching its folder, and jsx-no-bind would reject the
        // inline handlers a story uses to stand in for real behaviour. Tests are ignored here for
        // the same reason.
        ignores: [
            "src/**/use-*.tsx",
            "src/**/*.test.tsx",
            "src/**/*.stories.tsx",
            "src/test-utils/**",
            "src/stories/**",
        ],
        plugins: { chicio },
        rules: {
            "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
            "chicio/prefer-component-store": "error",
            "chicio/folder-composition": "error",
        },
    },
    {
        files: ["src/**/use-*-store.ts"],
        plugins: { chicio },
        rules: { "chicio/store-return-shape": "error" },
    },
    {
        files: ["src/**/index.ts"],
        ignores: ["src/index.ts"],
        plugins: { chicio },
        rules: { "chicio/index-only-component": "error" },
    },
    {
        files: ["*.cjs"],
        languageOptions: { globals: globals.node, sourceType: "commonjs" },
    },
];
