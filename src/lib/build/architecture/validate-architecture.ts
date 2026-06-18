import { resolve } from "path";
import { Project } from "ts-morph";
import { modeFor } from "./allowlist";
import { folderShape } from "./rules/folder-shape";
import { hookNaming } from "./rules/hook-naming";
import { indexBarrel } from "./rules/index-barrel";
import { storeReturnShape } from "./rules/store-return-shape";
import { componentSingleHook } from "./rules/component-single-hook";
import { importBoundary } from "./rules/import-boundary";

export type Violation = {
    file: string;
    rule: string;
    message: string;
};

export type RuleContext = {
    project: Project;
    componentsRoot: string;
    repoRoot: string;
};

export type Rule = (ctx: RuleContext) => Violation[];

const RULES: Rule[] = [folderShape, hookNaming, indexBarrel, storeReturnShape, componentSingleHook, importBoundary];

export const validateArchitecture = (): void => {
    const repoRoot = process.cwd();
    const ctx: RuleContext = {
        repoRoot,
        componentsRoot: resolve(repoRoot, "src/components"),
        project: new Project({ tsConfigFilePath: resolve(repoRoot, "tsconfig.json") }),
    };

    const all: Violation[] = RULES.flatMap((rule) => rule(ctx));
    const errors = all.filter((v) => modeFor(v.file) === "error");
    const warnings = all.filter((v) => modeFor(v.file) === "warn");

    for (const v of warnings) {
        console.warn(`[WARN]  [${v.rule}] ${v.file}: ${v.message}`);
    }
    for (const v of errors) {
        console.error(`[ERROR] [${v.rule}] ${v.file}: ${v.message}`);
    }
    console.log(`\nArchitecture: ${errors.length} error(s), ${warnings.length} warning(s).`);
    if (errors.length > 0) {
        process.exit(1);
    }
};
