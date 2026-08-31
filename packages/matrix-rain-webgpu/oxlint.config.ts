import { defineConfig } from 'oxlint';
import typegpu from 'eslint-plugin-typegpu';

export default defineConfig({
  // The docs/ Astro app is a separate package (own conventions + its own astro check);
  // dist/ is the lib build output. The root linter covers only the library source.
  ignorePatterns: ['docs/', 'dist/'],
  plugins: ['typescript', 'import', 'unicorn', 'oxc', 'react'],
  jsPlugins: ['eslint-plugin-typegpu'],
  categories: {
    correctness: 'warn',
    suspicious: 'warn',
  },
  rules: {
    ...typegpu.configs.recommended.rules,
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-unsafe-type-assertion': 'off',
    'import/no-named-as-default': 'off',
    // React 17+ automatic JSX runtime — no need for React in scope.
    'react/react-in-jsx-scope': 'off',
  },
  env: {
    builtin: true,
    browser: true,
  },
});
