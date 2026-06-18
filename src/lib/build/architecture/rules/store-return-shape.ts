import { basename, relative, sep } from "path";
import { Node } from "ts-morph";
import type { Rule, Violation } from "../validate-architecture";

const REQUIRED = ["state", "effects"];

export const storeReturnShape: Rule = ({ project, componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    for (const sf of project.getSourceFiles(`${componentsRoot}/**/use-*-store.ts`)) {
        const file = sf.getFilePath();
        for (const decl of sf.getVariableDeclarations()) {
            const init = decl.getInitializer();
            if (!init || !Node.isArrowFunction(init)) {
                continue;
            }
            const type = init.getReturnType();
            const props = type.getProperties().map((p) => p.getName()).sort();
            const ok = props.length === REQUIRED.length && REQUIRED.every((k) => props.includes(k));
            if (!ok) {
                violations.push({
                    file: rel(file),
                    rule: "store-return-shape",
                    message: `Store "${decl.getName()}" must return exactly { state, effects }; got { ${props.join(", ")} }.`,
                });
            }
        }
    }
    return violations;
};
