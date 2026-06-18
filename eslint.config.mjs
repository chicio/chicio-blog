import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const ignores = { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**", ".agents/**", "public/**",] };

const componentStoreRules = {
    files: ["src/components/**/*.tsx"],
    ignores: ["src/components/**/use-*.tsx"],
    rules: {
        "react/jsx-no-bind": ["warn", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "no-restricted-syntax": [
            "warn",
            {
                selector: "CallExpression[callee.name=/^use(State|Effect|Memo|Callback|Reducer|Ref|Context|SyncExternalStore)$/]",
                message: "React hooks belong in this component's use<Name>Store hook.",
            },
            {
                selector: "CallExpression[callee.name=/^use(Scroll|Transform|Spring|MotionValue|Animate|InView|Animation)$/]",
                message: "Framer Motion hooks belong in this component's use<Name>Store hook.",
            },
        ],
    },
};

const eslintConfig = [ignores, ...coreWebVitals, ...typescript, componentStoreRules];

export default eslintConfig;
