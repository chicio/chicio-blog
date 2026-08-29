import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    dts: true,
    clean: true,
    // One output file per source file: a bundled chunk would hoist away the per-file "use client"
    // directives the React Server Components boundary depends on, and would defeat tree-shaking.
    unbundle: true,
});
