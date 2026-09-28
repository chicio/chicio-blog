import { FC, PropsWithChildren } from "react";

export const CoverCardBadge: FC<PropsWithChildren> = ({ children }) => (
    <span className="glow-border bg-general-background-light text-primary px-2 py-2 font-mono text-base text-shadow-sm">
        {children}
    </span>
);
