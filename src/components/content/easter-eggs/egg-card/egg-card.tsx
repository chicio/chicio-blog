"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";

export type EggCardProps = PropsWithChildren<{
    title: string;
}>;

export const EggCard: FC<EggCardProps> = ({ title, children }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`${glassmorphismClass} my-4 p-4 sm:p-6`}>
            <TerminalLine>
                {">"} {title}
            </TerminalLine>
            <div className="egg-card-content">{children}</div>
        </div>
    );
};
