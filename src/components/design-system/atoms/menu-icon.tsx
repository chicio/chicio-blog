import styled from "styled-components";
import { Icon } from "./icon";
import { StyledIconBase } from "@styled-icons/styled-icon";

export const MenuIcon = styled(Icon)`
  ${StyledIconBase} {
    color: ${(props) => props.theme.light.primaryTextColor};
  }
`;