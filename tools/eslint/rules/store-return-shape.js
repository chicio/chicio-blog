// @ts-check
"use strict";

const path = require("path");

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Store hooks (use-*-store.ts) must return an object with exactly the keys 'state' and 'effects'.",
        },
        schema: [],
        messages: {
            wrongShape:
                "Store hook must return exactly { state, effects }. Found keys: {{found}}.",
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

            const hasState = keys.includes("state");
            const hasEffects = keys.includes("effects");
            const exactlyTwo = keys.length === 2;

            if (!hasState || !hasEffects || !exactlyTwo) {
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
