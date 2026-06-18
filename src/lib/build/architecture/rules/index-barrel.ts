import { basename, dirname, relative, sep } from "path";
import type { Rule, Violation } from "../validate-architecture";

const TIER_DIRS = new Set(["atoms", "molecules", "organism", "organisms", "templates"]);

export const indexBarrel: Rule = ({ project, componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    for (const sf of project.getSourceFiles(`${componentsRoot}/**/index.ts`)) {
        const file = sf.getFilePath();
        const folder = basename(dirname(file));
        if (TIER_DIRS.has(folder)) {
            continue;
        }
        const exported = [...sf.getExportedDeclarations().keys()];
        for (const name of exported) {
            if (/^use[A-Z]/.test(name)) {
                violations.push({ file: rel(file), rule: "index-barrel", message: `index.ts must not export hook "${name}".` });
            }
        }
    }
    return violations;
};
