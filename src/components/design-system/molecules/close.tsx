import { X } from "@styled-icons/boxicons-regular/X";
import { FC } from "react";
import { MenuIcon } from "../atoms/menu-icon";

interface CloseProps {
  onClick: () => void;
}

export const Close: FC<CloseProps> = ({ onClick }) => (
  <MenuIcon>
    <X size={35} onClick={onClick} />
  </MenuIcon>
);
