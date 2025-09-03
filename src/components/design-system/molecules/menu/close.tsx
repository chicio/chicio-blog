import { BiX } from "react-icons/bi";import { FC } from "react";

interface CloseProps {
  onClick: () => void;
}

export const Close: FC<CloseProps> = ({ onClick }) => (
  <BiX className="size-9 text-primary-text" onClick={onClick} />
);
