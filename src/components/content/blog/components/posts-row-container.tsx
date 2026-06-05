import { FC, PropsWithChildren } from "react";

export const PostsRowContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex w-full flex-col md:flex-row md:justify-between">
    {children}
  </div>
);
