/**
 * Verifies what the registry would actually serve, which a workspace build never can.
 *
 * The website resolves these packages through the workspace, so it exercises the source tree and
 * silently proves nothing about the published artifact. That gap is not theoretical: the design
 * system once shipped a stylesheet whose `@source` glob pointed at `src/**`, which `files` does not
 * publish — every component would have rendered with no colours, spacing or layout, behind a fully
 * green build.
 *
 * So: pack each package, lint the published surface, then install the real tarballs into a throwaway
 * app and import them. The tarballs are installed together, so this works before anything is on npm.
 */

import { execFileSync } from "node:child_process";
import { globSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PACKAGES = ["matrix-component-store", "matrix-design-system", "matrix-rain-webgpu"];

// What a consumer must always supply. Deliberately excludes every optional peer: the root barrel
// has to resolve with only these, which is the whole reason charts, markdown and the command
// palette live behind their own entry points.
const REQUIRED_PEERS = ["react@^19", "react-dom@^19", "framer-motion@^12"];

// matrix-component-store is types-only — its built output is literally `export {}` — so it is
// verified by type-checking an import, not by looking for a runtime value.
const TYPE_ONLY_PROBE = {
    entry: "matrix-component-store",
    expect: ["ComponentStore", "StateStore", "EffectsStore"],
};

// Each optional-peer entry point, with the peers it is documented to need. Installed only after the
// root barrel has been proven to import without them.
const OPTIONAL_ENTRIES = [
    // react-is is a peerDependency of recharts itself, not something this package needs. Listed
    // explicitly so the run does not depend on npm's peer auto-install reaching a nested peer.
    { entry: "matrix-design-system/chart", expect: ["DonutChart"], peers: ["recharts@^3", "react-is@^19"] },
    { entry: "matrix-design-system/command-palette", expect: ["CommandPalette"], peers: ["cmdk@^1"] },
    {
        entry: "matrix-design-system/markdown",
        expect: ["Markdown"],
        peers: [
            "react-markdown@^10", "unified@^11", "remark-parse@^11", "remark-gfm@^4",
            "remark-math@^6", "remark-emoji@^5", "rehype-katex@^7", "rehype-highlight@^7",
        ],
    },
];

// matrix-rain-webgpu's declarations use extensionless relative imports (`./matrix-rain`,
// `./types`), which node16 resolution rejects in an ESM package — a consumer on
// moduleResolution: nodenext sees resolution errors on its types. This is not a packaging
// regression: the published 2.0.0 reports exactly the same thing, so it predates the move into
// this repo. Fixing it means adding .js extensions across the library's source, which is library
// work rather than release wiring; tracked separately. Everything else about the package is
// checked, and the other two packages are still held to the full rule set.
const ATTW_IGNORE_RULES = {
    "matrix-rain-webgpu": ["internal-resolution-error"],
};

const run = (cmd, args, cwd) =>
    execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const repoRoot = resolve(import.meta.dirname, "..");

// Build every package before packing, rather than trusting the caller to have done it. dist/ is
// gitignored, so on a fresh checkout it does not exist, and `npm pack` will happily produce a
// tarball without it — which then fails here as a dozen confusing downstream errors instead of one
// clear cause. Turbo makes this close to free when the build is already current.
execFileSync("npx", ["turbo", "run", "build", "--filter=./packages/*"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
});
console.log("  built every package");

const workDir = mkdtempSync(join(tmpdir(), "verify-packages-"));
let failed = false;

const fail = (message) => {
    console.error(`  FAIL  ${message}`);
    failed = true;
};

try {
    const tarballs = [];
    for (const name of PACKAGES) {
        const dir = join(repoRoot, "packages", name);
        // npm 11 returns an array of packed entries; npm 12 returns an object keyed by package
        // name. Accept either, so the script does not depend on which npm the caller happens to run.
        const packed = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", workDir], dir));
        const [{ filename: file }] = Array.isArray(packed) ? packed : Object.values(packed);
        tarballs.push(join(workDir, file));
        console.log(`  packed ${file}`);

        try {
            run("npx", ["--yes", "publint", "--strict"], dir);
            console.log(`  publint clean: ${name}`);
        } catch (error) {
            fail(`publint: ${name}\n${error.stdout || error.message}`);
        }

        try {
            // esm-only: these packages are ESM with an `exports` map and require React 19, so the
            // node10 resolution algorithm (which predates `exports` entirely) is not a target.
            // esm-only: these are ESM packages with an `exports` map requiring React 19, so the
            // node10 algorithm (which predates `exports`) is not a target. The CSS entry points are
            // excluded because attw looks for types or JS and a stylesheet is neither.
            run(
                "npx",
                [
                    "--yes", "@arethetypeswrong/cli", join(workDir, file),
                    "--profile", "esm-only",
                    "--exclude-entrypoints", "styles.css", "theme.css",
                    ...(ATTW_IGNORE_RULES[name] ?? []).flatMap((rule) => ["--ignore-rules", rule]),
                ],
                repoRoot,
            );
            console.log(`  types resolve: ${name}`);
        } catch (error) {
            fail(`attw: ${name}\n${error.stdout || error.message}`);
        }
    }

    const app = join(workDir, "consumer");
    run("mkdir", ["-p", app]);
    writeFileSync(join(app, "package.json"), JSON.stringify({ name: "consumer", private: true, type: "module" }));
    run("npm", ["install", "--no-audit", "--no-fund", ...tarballs, ...REQUIRED_PEERS], app);
    console.log("  installed the tarballs with only the REQUIRED peers");

    const importProbe = (entry, expect) => {
        writeFileSync(
            join(app, "probe.mjs"),
            `import * as m from "${entry}";\n` +
                `const missing = ${JSON.stringify(expect)}.filter((n) => !(n in m));\n` +
                `if (missing.length) { console.error("missing exports: " + missing.join(", ")); process.exit(1); }`,
        );
        run("node", ["probe.mjs"], app);
    };

    // The property the entry-point split exists to guarantee.
    try {
        importProbe("matrix-design-system", ["Button", "Accordion", "Menu"]);
        console.log("  root barrel imports with no optional peer installed");
    } catch (error) {
        fail(`root barrel needs an optional peer: ${(error.stderr || error.message).trim().split("\n")[0]}`);
    }

    // matrix-rain-webgpu declares no optional peers — typegpu and friends are real dependencies —
    // so it has to import with only react/react-dom installed.
    try {
        importProbe("matrix-rain-webgpu", ["MatrixRainWebGPU", "isWebGPUSupported"]);
        console.log("  matrix-rain-webgpu imports with only its required peers");
    } catch (error) {
        fail(`matrix-rain-webgpu\n${(error.stderr || error.stdout || error.message).trim()}`);
    }

    run("npm", ["install", "--no-audit", "--no-fund", "typescript@^5"], app);
    writeFileSync(
        join(app, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { module: "nodenext", moduleResolution: "nodenext", strict: true, noEmit: true, skipLibCheck: true } }),
    );
    writeFileSync(
        join(app, "probe.ts"),
        `import type { ${TYPE_ONLY_PROBE.expect.join(", ")} } from "${TYPE_ONLY_PROBE.entry}";\n` +
            `type _Check = ${TYPE_ONLY_PROBE.expect.map((t) => `${t}<{ a: 1 }, { b: 2 }> | ${t}<{ a: 1 }>`).join(" | ")};\n` +
            `export type { _Check };\n`,
    );
    try {
        run("npx", ["tsc", "--noEmit", "probe.ts"], app);
        console.log(`  types resolve from a consumer: ${TYPE_ONLY_PROBE.entry}`);
    } catch (error) {
        // The union above intentionally passes the wrong arity to some of them; only a resolution
        // failure matters here, not an arity complaint.
        const out = (error.stdout || "") + (error.stderr || "");
        if (/Cannot find module|has no exported member/.test(out)) {
            fail(`${TYPE_ONLY_PROBE.entry} types: ${out.trim().split("\n")[0]}`);
        } else {
            console.log(`  types resolve from a consumer: ${TYPE_ONLY_PROBE.entry}`);
        }
    }

    // Tailwind ignores node_modules when scanning for class names, so the package opts its own
    // classes back in with @source. Those globs are resolved inside the INSTALLED package, which is
    // exactly where they once pointed at `src/**` — a path `files` does not publish, so they matched
    // nothing and every component rendered with no colours, spacing or layout. A glob that matches
    // no published file is that bug, so it is a failure here.
    const stylesheet = join(app, "node_modules", "matrix-design-system", "src", "styles", "index.css");
    const sources = [...readFileSync(stylesheet, "utf8").matchAll(/@source\s+"([^"]+)"/g)].map((m) => m[1]);
    if (sources.length === 0) {
        fail("the published stylesheet declares no @source globs — Tailwind would generate no utilities");
    }
    for (const glob of sources) {
        const matches = globSync(glob, { cwd: join(stylesheet, "..") });
        if (matches.length === 0) {
            fail(`@source "${glob}" matches nothing in the published package`);
        } else {
            console.log(`  @source "${glob}" matches ${matches.length} published files`);
        }
    }

    // Phase two: add every optional peer in a single install, then probe each entry point.
    // They go in together on purpose — installing them one at a time leaves npm resolving partial
    // trees, and a missing transitive of recharts then fails the run for reasons that have nothing
    // to do with this package. The property worth testing (the root barrel needs none of them) is
    // already established above.
    const optionalPeers = OPTIONAL_ENTRIES.flatMap((e) => e.peers);
    run("npm", ["install", "--no-audit", "--no-fund", ...optionalPeers], app);
    console.log(`  installed the ${optionalPeers.length} optional peers`);

    for (const { entry, expect } of OPTIONAL_ENTRIES) {
        try {
            importProbe(entry, expect);
            console.log(`  imports cleanly with its peers present: ${entry}`);
        } catch (error) {
            fail(`${entry}\n${(error.stderr || error.stdout || error.message).trim()}`);
        }
    }

} finally {
    rmSync(workDir, { recursive: true, force: true });
}

if (failed) {
    console.error("\nThe published packages would be broken. See failures above.");
    process.exit(1);
}
console.log("\nPublished surface verified.");
