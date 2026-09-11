import React, { PropsWithChildren } from "react";

export const MediaGrid: React.FC<PropsWithChildren> = ({ children }) => (
    <div className="box-border flex h-full w-full flex-col gap-4 overflow-auto p-4 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4 md:overflow-visible">
        {children}
    </div>
);
