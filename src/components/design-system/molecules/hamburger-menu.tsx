import { Menu } from "@styled-icons/boxicons-regular/Menu";
import { FC } from "react";
import { MenuIcon } from "../atoms/menu-icon";

interface HamburgerMenuProps {
    onClick: () => void;
}

export const HamburgerMenu: FC<HamburgerMenuProps> = ({onClick}) => (
    <MenuIcon>
        <Menu size={35} onClick={onClick}/>
    </MenuIcon>
);
