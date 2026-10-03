// SessionStart hook: installs the plugins this project enables but this machine has not installed yet.
// Project settings can declare a marketplace and enable plugins, but Claude Code never installs them on a new clone
// (claude-plugins/docs/adr/0002-claude-tooling-ships-as-plugins.md), so a fresh clone would load none of them.
// Silent when nothing is missing; a missing plugin loads after /reload-plugins or the next session.
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

const projectDir = realpathSync(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());

const run = (args) => execFileSync("claude", args, { cwd: projectDir, encoding: "utf8", stdio: "pipe" });

const enabledPlugins = () => {
    const settings = JSON.parse(readFileSync(join(projectDir, ".claude", "settings.json"), "utf8"));

    return Object.entries(settings.enabledPlugins ?? {})
        .filter(([, isEnabled]) => isEnabled === true)
        .map(([id]) => id);
};

const isInstalledHere = (entry) =>
    entry.scope === "user" || entry.scope === "managed" || entry.projectPath === projectDir;

const installedIds = () => {
    const entries = JSON.parse(run(["plugin", "list", "--json"]));

    return new Set(entries.filter(isInstalledHere).map((entry) => entry.id));
};

const main = () => {
    let installed;
    try {
        installed = installedIds();
    } catch {
        return;
    }
    const missing = enabledPlugins().filter((id) => !installed.has(id));
    if (missing.length === 0) {
        return;
    }
    const added = [];
    const failed = [];
    for (const id of missing) {
        try {
            run(["plugin", "install", id, "--scope", "project"]);
            added.push(id);
        } catch {
            failed.push(id);
        }
    }
    const lines = [];
    if (added.length > 0) {
        lines.push(`Installed ${added.join(", ")}: run /reload-plugins to load them.`);
    }
    if (failed.length > 0) {
        lines.push(`Could not install ${failed.join(", ")}: run claude plugin install <plugin> --scope project.`);
    }
    process.stdout.write(JSON.stringify({ systemMessage: lines.join(" ") }));
};

main();
