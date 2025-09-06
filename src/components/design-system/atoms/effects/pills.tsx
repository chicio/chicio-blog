import { FC, PropsWithChildren } from "react";

export const RedPill: FC<PropsWithChildren> = ({ children }) => (
  <div className={`pill pill-red`}>
    <span className="pill-label">{children}</span>
  </div>
);

export const BluePill: FC<PropsWithChildren> = ({ children }) => (
  <div className={`pill-blue pill`}>
    <span className="pill-label">{children}</span>
  </div>
);
