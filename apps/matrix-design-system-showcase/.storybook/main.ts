import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    // Stories live beside the components they document, inside the package. Storybook globs across
    // the workspace to reach them: colocation is what keeps a story honest when its component
    // changes, and it is also where .design-sync reads them from, so there is one source of truth.
    stories: ["../../../packages/matrix-design-system/src/**/*.stories.@(ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    typescript: {
        // The package ships its own declarations; re-deriving prop tables from source would make
        // the showcase disagree with what consumers actually get.
        reactDocgen: "react-docgen-typescript",
    },
};

export default config;
