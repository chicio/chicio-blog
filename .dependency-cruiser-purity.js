// @ts-check
"use strict";

/**
 * Design-system purity checker.
 *
 * Enforces the invariant: every import in src/components/design-system/**
 * that targets src/types/** must be type-only (import type { ... }).
 * Runtime value imports of slugs, siteMetadata, or tracking are forbidden;
 * those values must be injected as props from the feature/content layer.
 *
 * This config uses tsConfig for alias resolution so that dependencyTypes
 * correctly includes "type-only" for import-type statements. It is kept
 * separate from .dependency-cruiser.js to avoid exposing pre-existing
 * seal-private-nested-folders violations that the alias resolver would
 * surface in the main config before those migrations are complete.
 */

/** @type {import("dependency-cruiser").IConfiguration} */
const config = {
    forbidden: [
        {
            name: "design-system-types-type-only",
            comment: [
                "ERROR-level enforcement: all imports from src/types/ inside design-system must be type-only.",
                "Runtime value imports of slugs, siteMetadata, or tracking from @/types/configuration/ are forbidden.",
                "Those values must be injected as props from the app/features layer.",
                "Only 'import type { ... }' is permitted; 'import { ... }' is an error.",
            ].join(" "),
            severity: "error",
            from: {
                path: "^src/components/design-system/",
            },
            to: {
                path: "^src/types/",
                dependencyTypesNot: ["type-only"],
            },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
        },
        tsPreCompilationDeps: true,
        tsConfig: {
            fileName: "tsconfig.json",
        },
        moduleSystems: ["es6", "cjs"],
        reporterOptions: {
            text: {
                highlightFocused: true,
            },
        },
    },
};

module.exports = config;
