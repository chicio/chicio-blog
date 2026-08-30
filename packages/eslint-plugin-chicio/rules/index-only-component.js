// @ts-check
"use strict";

const path = require("path");
const fs = require("fs");

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Component-folder index.ts files must not export hooks (use* named exports).",
        },
        schema: [],
        messages: {
            hookExport:
                "index.ts must not re-export hooks. '{{name}}' looks like a hook — remove it from the barrel.",
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename();
        const basename = path.basename(filename);

        if (basename !== "index.ts") {
            return {};
        }

        const dir = path.dirname(filename);
        const siblings = fs.readdirSync(dir);
        const hasComponentFile = siblings.some((f) => f.endsWith(".tsx") && !f.startsWith("use-"));

        if (!hasComponentFile) {
            return {};
        }

        return {
            ExportNamedDeclaration(node) {
                for (const specifier of node.specifiers) {
                    const exported = specifier.exported;
                    const exportedName =
                        exported.type === "Identifier" ? exported.name : String(exported.value);
                    if (/^use[A-Z]/.test(exportedName)) {
                        context.report({
                            node: specifier,
                            messageId: "hookExport",
                            data: { name: exportedName },
                        });
                    }
                }
                if (node.declaration) {
                    const decNode = node.declaration;
                    if (decNode.type === "FunctionDeclaration" && decNode.id) {
                        if (/^use[A-Z]/.test(decNode.id.name)) {
                            context.report({
                                node: decNode,
                                messageId: "hookExport",
                                data: { name: decNode.id.name },
                            });
                        }
                    }
                    if (decNode.type === "VariableDeclaration") {
                        for (const declarator of decNode.declarations) {
                            if (declarator.id.type === "Identifier" && /^use[A-Z]/.test(declarator.id.name)) {
                                context.report({
                                    node: declarator,
                                    messageId: "hookExport",
                                    data: { name: declarator.id.name },
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};

module.exports = rule;
