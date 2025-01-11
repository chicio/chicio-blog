import {Menu} from "@styled-icons/boxicons-regular/Menu";
import {FC} from "react";
import {Icon} from "@/components/design-system/atoms/icon";

interface HamburgerMenuProps {
    onClick: () => void;
}

export const HamburgerMenu: FC<HamburgerMenuProps> = ({onClick}) => (
    <Icon>
        <Menu size={35} onClick={onClick}/>
    </Icon>
);
