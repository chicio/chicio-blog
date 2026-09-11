import { FC, PropsWithChildren } from "react";

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
    <div className="container-fixed mt-13 mb-8 flex-1 basis-auto">{children}</div>
);
