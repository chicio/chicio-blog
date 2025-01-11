'use client'

import styled from "styled-components";
import { ChevronDown } from "@styled-icons/boxicons-regular";
import { FC } from "react";
import {Icon} from "@/components/design-system/atoms/icon";
import {bounce} from "@/components/design-system/utils-css/bounce-keyframes";

const IconContainer = styled(Icon)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[10]};
  z-index: 100;
  animation: ${bounce} 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
`;

export const DownArrow: FC = () => (
  <IconContainer>
    <ChevronDown size={50} title={"Github"} />
  </IconContainer>
);
