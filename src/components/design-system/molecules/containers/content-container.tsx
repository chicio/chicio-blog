import { FC, PropsWithChildren } from "react";

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className='container-fixed flex-1 basis-auto mt-13 mb-8'>{children}</div>
);
