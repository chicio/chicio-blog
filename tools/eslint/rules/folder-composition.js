// @ts-check
"use strict";

const path = require("path");
const fs = require("fs");

// Design-system atomic tiers are PERMANENT grouping buckets: they hold component
// folders (e.g. atoms/<name>/<name>.tsx), never components directly, so they are exempt.
// Content/feature internal `components/` + `hooks/` buckets are intentionally NOT listed:
// the migration flattens them, so the rule SHOULD flag files still sitting in them.
const TIER_DIRS = new Set(["atoms", "molecules", "organism", "templates"]);
// design-system/hooks and design-system/utils are the flat homes for shared hooks/helpers.
const SKIP_DIRS = new Set(["hooks", "utils"]);

/**
 * @param {string} name
 * @returns {boolean}
 */
function isKebabCase(name) {
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Each component .tsx file must live in a kebab-case folder that matches its basename, " +
                "and the folder must contain an index.ts barrel. " +
                "Any use-*-store.ts present must follow the use-<dir>-store.ts naming.",
        },
        schema: [],
        messages: {
            dirNotKebab: "Component folder '{{dir}}' is not kebab-case.",
            fileNameMismatch:
                "Component file '{{file}}' must match its folder name '{{dir}}' (expected '{{dir}}.tsx').",
            missingIndex: "Component folder '{{dir}}' is missing an index.ts barrel.",
            storeNameMismatch:
                "Store hook file '{{found}}' must be named 'use-{{dir}}-store.ts'.",
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename();
        const basename = path.basename(filename, ".tsx");
        const dir = path.dirname(filename);
        const dirName = path.basename(dir);

        if (basename.startsWith("use-")) {
            return {};
        }

        if (TIER_DIRS.has(dirName) || SKIP_DIRS.has(dirName)) {
            return {};
        }

        const parentDirName = path.basename(path.dirname(dir));
        if (TIER_DIRS.has(parentDirName) && dirName === parentDirName) {
            return {};
        }

        return {
            Program(node) {
                if (!isKebabCase(dirName)) {
                    context.report({ node, messageId: "dirNotKebab", data: { dir: dirName } });
                    return;
                }

                if (basename !== dirName) {
                    context.report({
                        node,
                        messageId: "fileNameMismatch",
                        data: { file: basename + ".tsx", dir: dirName },
                    });
                }

                const siblings = fs.readdirSync(dir);

                if (!siblings.includes("index.ts")) {
                    context.report({ node, messageId: "missingIndex", data: { dir: dirName } });
                }

                const storeFiles = siblings.filter((f) => /^use-.+-store\.ts$/.test(f));
                const expectedStore = `use-${dirName}-store.ts`;
                for (const storeFile of storeFiles) {
                    if (storeFile !== expectedStore) {
                        context.report({
                            node,
                            messageId: "storeNameMismatch",
                            data: { found: storeFile, dir: dirName },
                        });
                    }
                }
            },
        };
    },
};

module.exports = rule;
