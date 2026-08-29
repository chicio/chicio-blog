// @ts-check
"use strict";

const path = require("path");

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Store hooks (use-*-store.ts) must return an object whose keys are a non-empty subset of 'state' and 'effects'.",
        },
        schema: [],
        messages: {
            wrongShape:
                "Store hook must return a non-empty subset of { state, effects }. Found keys: {{found}}.",
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename();
        const basename = path.basename(filename);

        if (!/-store\.ts$/.test(basename)) {
            return {};
        }

        function checkObjectExpression(objExpr) {
            const keys = objExpr.properties
                .filter((p) => p.type === "Property")
                .map((p) => {
                    if (p.key.type === "Identifier") {
                        return p.key.name;
                    }
                    return null;
                })
                .filter(Boolean);

            const allowedKeys = new Set(["state", "effects"]);
            const hasOnlyAllowedKeys = keys.every((k) => allowedKeys.has(k));
            const hasAtLeastOneAllowedKey = keys.length > 0;

            if (!hasOnlyAllowedKeys || !hasAtLeastOneAllowedKey) {
                context.report({
                    node: objExpr,
                    messageId: "wrongShape",
                    data: { found: keys.join(", ") || "(none)" },
                });
            }
        }

        return {
            ReturnStatement(node) {
                if (!node.argument) {
                    return;
                }
                if (node.argument.type === "ObjectExpression") {
                    checkObjectExpression(node.argument);
                }
            },
            ArrowFunctionExpression(node) {
                if (node.expression && node.body.type === "ObjectExpression") {
                    checkObjectExpression(node.body);
                }
            },
        };
    },
};

module.exports = rule;
