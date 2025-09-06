import { FC, PropsWithChildren } from "react";

export const CenterContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className='container-fixed flex justify-center items-center flex-col w-full h-full gap-4'>{children}</div>
);