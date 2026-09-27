# The package applies the React Compiler itself, to "use client" modules only

The design system runs `babel-plugin-react-compiler` (target `"19"`) inside its own tsdown build, and only on modules
whose source starts with a `"use client"` directive. The website has `reactCompiler: true`, but Next never compiles code
under `node_modules`, which is where the workspace package resolves from: Turbopack never runs Babel over "foreign"
code, and webpack's compiler condition hard-codes a `node_modules` exclusion. So compiling in the package is the only
way the site gets memoized design-system components, and it is what React recommends to library authors ("you can
compile your library code before publishing to npm… all users get the same optimized version regardless of their build
setup"). It is also the better place: the compiler wants input close to the original source, and by the time a consumer
could see `dist` the JSX is already lowered.

Only client modules are compiled because compiled output calls `c()` from `react/compiler-runtime`, which needs React's
hooks dispatcher: a client component has one even while being server-rendered, a server component never does, and
compiling one crashes the render with "Cannot read properties of undefined (reading 'H')". Next applies the same rule by
skipping the compiler for its server build. The filter is this repository's own mechanism, not a compiler option: the
compiler has no server-component awareness.

## Considered Options

- **Let the consuming app compile the package** (e.g. `transpilePackages`): not possible in Next 16. `transpilePackages`
  does not lift the `node_modules` exclusion on either bundler.
- **Do not compile the package**: 13 KB gzip lighter across the whole library (the compiler adds about 41%), but every
  component loses automatic memoization, and getting it back means hand-written `useMemo`/`useCallback` in dozens of
  components.
- **Compile every module**: crashes every server component, as above.

## Consequences

- Target `"19"` imports the runtime from `react/compiler-runtime`, built into React, which matches the package's
  `react >=19` peer range; no `react-compiler-runtime` dependency is needed. Lowering the peer range below 19 means
  changing the target and adding that dependency.
- Vitest tests `src`, so it never exercises compiled code. The website build and the Playwright suite run against the
  compiled `dist`, and they are the with-compilation test React advises: run e2e after any change to the compiler setup.
- A file whose `"use client"` is not its first statement (for example after a leading comment) is silently left
  uncompiled.
