import { createGlobalStyle } from "styled-components";
import { glitch } from "@/components/design-system/utils/animations/glitch-keyframes";

export const GlobalStyle = createGlobalStyle`
    html {
        max-width: 100%;
        overflow-x: hidden;
        height: 100%;
    }

    body {
        background-color: ${(props) => props.theme.colors.generalBackground};
        font: ${(props) => props.theme.fontSizes[0]} 'Open Sans', Arial, sans-serif;
        max-width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    /* https://www.w3schools.com/css/css3_box-sizing.asp */
    * {
        box-sizing: border-box;
    }

    :root {
        color-scheme: dark;
    }

    body.glitch-active, body.glitch-active * {
      animation: ${glitch} 0.3s infinite;
    }
`;
