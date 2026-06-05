import React, { PropsWithChildren } from "react";

export const MediaGrid: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="box-border flex flex-col h-full w-full md:grid md:grid-cols-2 md:grid-rows-2 gap-4 overflow-auto p-4 md:gap-4 md:overflow-visible">
    {children}
  </div>
);
