import { basename, dirname, relative, sep } from "path";
import { SyntaxKind } from "ts-morph";
import type { Rule, Violation } from "../validate-architecture";

const pascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

export const componentSingleHook: Rule = ({ project, componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    for (const sf of project.getSourceFiles(`${componentsRoot}/**/*.tsx`)) {
        const file = sf.getFilePath();
        if (basename(file).startsWith("use-")) {
            continue;
        }
        const folder = basename(dirname(file));
        const allowed = `use${pascal(folder)}Store`;
        const hookCalls = sf
            .getDescendantsOfKind(SyntaxKind.CallExpression)
            .map((n) => n.getExpression().getText())
            .filter((name) => /^use[A-Z]/.test(name));

        const extra = hookCalls.filter((name) => name !== allowed);
        if (extra.length > 0) {
            violations.push({
                file: rel(file),
                rule: "component-single-hook",
                message: `Component may only call "${allowed}()"; found disallowed hook call(s): ${[...new Set(extra)].join(", ")}.`,
            });
        }
        if (hookCalls.filter((n) => n === allowed).length > 1) {
            violations.push({
                file: rel(file),
                rule: "component-single-hook",
                message: `"${allowed}()" must be called at most once.`,
            });
        }
    }
    return violations;
};
