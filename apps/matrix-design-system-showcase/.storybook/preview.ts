import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
    parameters: {
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
        // The design system assumes a dark surface: its stylesheet sets html/body to #001100 on
        // #E8FFE8, and most components are near-invisible on white. Storybook's default light
        // canvas would misrepresent every single one.
        backgrounds: { disable: true },
    },
};

export default preview;
