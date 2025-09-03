import { FC, PropsWithChildren } from "react";

export const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="mb-5 text-center">{children}</h2>
);
