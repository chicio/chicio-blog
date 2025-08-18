import {Menu} from "@styled-icons/boxicons-regular/Menu";
import {FC} from "react";
import {Icon} from "@/components/design-system/atoms/icon";
import styled from "styled-components";
import { StyledIconBase } from "@styled-icons/styled-icon";

interface HamburgerMenuProps {
    onClick: () => void;
}

const MenuIcon = styled(Icon)`
  ${StyledIconBase} {
    color: ${(props) => props.theme.light.primaryTextColor};
  }
`;

export const HamburgerMenu: FC<HamburgerMenuProps> = ({onClick}) => (
    <MenuIcon>
        <Menu size={35} onClick={onClick}/>
    </MenuIcon>
);
