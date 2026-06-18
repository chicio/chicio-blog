import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const ignores = { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**", ".agents/**", "public/**",] };

const eslintConfig = [ignores, ...coreWebVitals, ...typescript];

export default eslintConfig;
