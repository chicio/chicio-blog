'use client'

import { css } from "styled-components";
import {borderRadius} from "@/components/design-system/atoms/border-radius";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";

export const callToActionStyle = css`
  font-size: ${(props) => props.theme.fontSizes[3]};
  background-color: ${(props) => props.theme.dark.accentColor};
  color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  padding: ${(props) => props.theme.spacing[2]};
  border: none;
  ${borderRadius};
  margin: ${(props) => props.theme.spacing[0]};
  line-height: 1;
  text-align: center;
  display: inline-block;
  min-width: 120px;
  backdrop-filter: blur(10px);
  color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  text-decoration: none;

  ${mediaQuery.inputDevice.mouse} {
    transition: transform 0.15s;
  }

  &:hover {
    text-decoration: none;
    box-shadow: 0 0 25px ${(props) => props.theme.dark.accentColor}70;

    ${mediaQuery.inputDevice.mouse} {
      transform: scale(1.1);
    }
  }
`;
