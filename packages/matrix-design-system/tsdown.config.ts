import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";
import babelPlugin from "@rolldown/plugin-babel";

const isClientModule = (filename: string): boolean => {
    try {
        return /^\s*(["'])use client\1/.test(readFileSync(filename, "utf8"));
    } catch {
        return false;
    }
};

export default defineConfig(async () => ({
    entry: ["src/index.ts", "src/chart.ts", "src/markdown.ts", "src/command-palette.ts"],
    format: "esm" as const,
    dts: true,
    clean: true,
    // One output file per source file: a bundled chunk would hoist away the per-file "use client"
    // directives the React Server Components boundary depends on, and would defeat tree-shaking.
    unbundle: true,
    plugins: [
        // The React Compiler is a Next build-time optimisation and Next never sees these sources: it
        // skips node_modules and confines its loader to the app directory, so the package has to
        // apply the compiler itself. Here is also the better place — the compiler wants input as
        // close to the original source as possible, and by the time Next could see dist the JSX is
        // already lowered to jsx() calls.
        //
        // Only "use client" modules are compiled, which is the same rule Next applies (it passes
        // isServer and skips the compiler for the server bundle). The compiler's output calls c()
        // from react/compiler-runtime, and c() needs React's hooks dispatcher: a client component
        // has one even while being server-rendered, a server component never does, and compiling
        // one crashes the render with "Cannot read properties of undefined (reading 'H')".
        await babelPlugin({
            include: (filename?: string) => filename !== undefined && isClientModule(filename),
            exclude: [/node_modules/, /\.test\.tsx?$/],
            parserOpts: { plugins: ["typescript", "jsx"] },
            plugins: [["babel-plugin-react-compiler", { target: "19" }]],
        }),
    ],
}));
