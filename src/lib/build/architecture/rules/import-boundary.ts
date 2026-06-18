import { dirname, relative, sep } from "path";
import type { Rule, Violation } from "../validate-architecture";

export const importBoundary: Rule = ({ project, componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    for (const sf of project.getSourceFiles()) {
        const importerDir = dirname(sf.getFilePath());
        for (const imp of sf.getImportDeclarations()) {
            const target = imp.getModuleSpecifierSourceFile();
            if (!target) {
                continue;
            }
            const targetPath = target.getFilePath();
            if (!targetPath.startsWith(componentsRoot)) {
                continue;
            }
            const targetFolder = dirname(targetPath);
            const importsIndex = /index\.ts$/.test(targetPath);
            const importerInside = importerDir === targetFolder || importerDir.startsWith(targetFolder + sep);
            if (!importsIndex && !importerInside) {
                violations.push({
                    file: rel(sf.getFilePath()),
                    rule: "import-boundary",
                    message: `Imports "${rel(targetPath)}" directly; must import the component via its folder index.ts.`,
                });
            }
        }
    }
    return violations;
};
