import { BiMenu } from "react-icons/bi";
import { FC } from "react";

interface HamburgerMenuProps {
  onClick: () => void;
}

export const HamburgerMenu: FC<HamburgerMenuProps> = ({ onClick }) => (
  <BiMenu className="size-9" onClick={onClick} />
);
