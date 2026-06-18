import { readdirSync, statSync, existsSync } from "fs";
import { join, basename, relative, sep } from "path";
import type { Rule, Violation } from "../validate-architecture";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIER_DIRS = new Set(["atoms", "molecules", "organism", "organisms", "templates"]);
const SKIP_DIRS = new Set(["hooks", "utils"]);

export const folderShape: Rule = ({ componentsRoot, repoRoot }) => {
    const violations: Violation[] = [];
    const rel = (p: string) => relative(repoRoot, p).split(sep).join("/");

    const walk = (dir: string): void => {
        const entries = readdirSync(dir).map((n) => join(dir, n));
        const dirs = entries.filter((p) => statSync(p).isDirectory());
        const files = entries.filter((p) => statSync(p).isFile());
        const componentFiles = files.filter(
            (p) => p.endsWith(".tsx") && !basename(p).startsWith("use-"),
        );

        if (componentFiles.length > 0) {
            const folder = basename(dir);
            if (!TIER_DIRS.has(folder) && !KEBAB.test(folder)) {
                violations.push({ file: rel(dir), rule: "folder-shape", message: `Folder "${folder}" is not kebab-case.` });
            }
            if (!existsSync(join(dir, "index.ts"))) {
                violations.push({ file: rel(dir), rule: "folder-shape", message: `Missing index.ts barrel.` });
            }
            if (componentFiles.length > 1) {
                violations.push({ file: rel(dir), rule: "folder-shape", message: `Folder has multiple component files; expected one named "${folder}.tsx".` });
            } else if (basename(componentFiles[0]) !== `${folder}.tsx`) {
                violations.push({ file: rel(componentFiles[0]), rule: "folder-shape", message: `Component file must be "${folder}.tsx".` });
            }
        }

        for (const d of dirs) {
            if (!SKIP_DIRS.has(basename(d))) {
                walk(d);
            }
        }
    };

    walk(componentsRoot);
    return violations;
};
