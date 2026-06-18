import { basename, dirname, relative, sep } from "path";
import type { Rule, Violation } from "../validate-architecture";

const pascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

export const hookNaming: Rule = ({ project, componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    for (const sf of project.getSourceFiles(`${componentsRoot}/**/use-*.ts`)) {
        const file = sf.getFilePath();
        const folder = basename(dirname(file));
        const exported = [...sf.getExportedDeclarations().keys()];
        const isStoreFile = basename(file) === `use-${folder}-store.ts`;

        if (isStoreFile) {
            const expected = `use${pascal(folder)}Store`;
            if (!exported.includes(expected)) {
                violations.push({ file: rel(file), rule: "hook-naming", message: `Store file must export "${expected}".` });
            }
        } else {
            for (const name of exported) {
                if (name.endsWith("Store")) {
                    violations.push({ file: rel(file), rule: "hook-naming", message: `Only the top hook may end in "Store"; "${name}" is a sub-hook.` });
                }
            }
        }
    }
    return violations;
};
