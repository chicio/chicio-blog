import { createGlobalStyle } from "styled-components";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import 'cookieconsent/build/cookieconsent.min.css';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Open Sans';
    src: local("Open Sans Regular"),
    url("/fonts/opensans/OpenSans-Regular.woff2") format("woff2"),
    url("/fonts/opensans/OpenSans-Regular.woff") format("woff"),
    url('/fonts/opensans/OpenSans-Regular.eot?#iefix') format('embedded-opentype'),
    url('/fonts/opensans/OpenSans-Regular.ttf') format('truetype'),
    url('/fonts/opensans/OpenSans-Regular.svg#OpenSansRegular') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: fallback;
  }

  html {
    max-width: 100%;
    overflow-x: hidden;
    height: 100%;
  }

  body {
    background-color: ${(props) => props.theme.light.generalBackground};
    font: ${(props) => props.theme.fontSizes[0]} 'Open Sans', Arial, sans-serif;
    max-width: 100%;
    height: 100%;
    margin: 0;

    ${mediaQuery.dark} {
      background-color: ${(props) => props.theme.dark.generalBackground};
    }
  }
  
  /* https://www.w3schools.com/css/css3_box-sizing.asp */
  * {
    box-sizing: border-box;
  }
`;
