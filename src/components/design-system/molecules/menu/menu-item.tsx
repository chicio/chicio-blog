"use client";

import Link from "next/link";
import { FC, PropsWithChildren } from "react";

export interface MenuItemProps extends PropsWithChildren {
  to: string;
  className?: string;
  selected: boolean;
  onClick?: () => void;
}

export const MenuItem: FC<MenuItemProps> = ({ to, className, selected, children, onClick }) => {
  const color = selected ? 'text-accent' : 'text-primary-text';
  const spacing = 'px-4 py-5 xs:px-2 xs:py-1';
  const text = 'text-base md:text-lg text-shadow-md text-center no-underline';
  const transition = 'transition-all duration-300';
  const border = `border border-solid rounded-xl ${selected ? 'border-accent' : 'border-transparent'}`;
  const flex = `flex items-center justify-center`;
  const background = selected ? 'bg-accent-alpha-15' : 'transparent';
  const hover = `hover:bg-accent-alpha-10 hover:text-accent hover:border-accent hover:transition-all hover:duration-300 hover:translate-y-[-1px] hover:shadow-lg`;

  return (
    <Link href={to} className={`relative ${transition} ${className} ${color} ${spacing} ${text} ${border} ${flex} ${background} ${hover}`} onClick={onClick}>
      {children}
    </Link>
  );
};
