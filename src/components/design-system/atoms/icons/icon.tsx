import { FC, PropsWithChildren } from "react";

interface RoundedIconProps extends PropsWithChildren {
  className?: string;
}

export const RoundedIcon: FC<RoundedIconProps> = ({ children, className }) => (
  <div
    className={`bg-accent flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-125 md:h-[50px] md:w-[50px] ${className}`}
  >
    {children}
  </div>
);
