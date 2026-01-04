import { FC, PropsWithChildren } from "react";

export const PageTitle: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="mb-6">{children}</h1>
);
