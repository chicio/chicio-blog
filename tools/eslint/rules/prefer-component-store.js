// @ts-check
"use strict";

const path = require("path");

/**
 * @param {string} kebab
 * @returns {string}
 */
function toPascalCase(kebab) {
    return kebab
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Component files (.tsx, not use-*.tsx) may only call their own useXxxStore() hook — no other use* calls.",
        },
        schema: [],
        messages: {
            wrongHook: "Component may only call use{{expected}}Store(). Found disallowed hook: {{found}}.",
            tooManyCalls: "use{{expected}}Store() must be called at most once.",
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename();
        const basename = path.basename(filename, ".tsx");
        const dirName = path.basename(path.dirname(filename));

        if (basename.startsWith("use-")) {
            return {};
        }

        const expectedStoreName = "use" + toPascalCase(dirName) + "Store";
        const storeCalls = [];
        const violations = [];

        return {
            CallExpression(node) {
                const callee = node.callee;
                if (callee.type !== "Identifier") {
                    return;
                }
                const name = callee.name;
                if (!/^use[A-Z]/.test(name)) {
                    return;
                }
                if (name === expectedStoreName) {
                    storeCalls.push(node);
                } else {
                    violations.push({ node, name });
                }
            },
            "Program:exit"() {
                for (const v of violations) {
                    context.report({
                        node: v.node,
                        messageId: "wrongHook",
                        data: { expected: toPascalCase(dirName), found: v.name },
                    });
                }
                if (storeCalls.length > 1) {
                    context.report({
                        node: storeCalls[1],
                        messageId: "tooManyCalls",
                        data: { expected: toPascalCase(dirName) },
                    });
                }
            },
        };
    },
};

module.exports = rule;
