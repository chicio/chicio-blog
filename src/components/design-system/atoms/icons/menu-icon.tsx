import styled from "styled-components";
import { Icon } from "../effects/icon";
import { StyledIconBase } from "@styled-icons/styled-icon";

export const MenuIcon = styled(Icon)`
  ${StyledIconBase} {
    color: ${(props) => props.theme.colors.primaryTextColor};
  }
`;