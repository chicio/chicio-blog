"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { FC, ReactNode } from "react";

export interface ReadNextTerminalWindowProps {
    title: string;
    children: ReactNode;
}

export const ReadNextTerminalWindow: FC<ReadNextTerminalWindowProps> = ({ title, children }) => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });

    return (
        <div className={`${glassmorphismClass} overflow-hidden`}>
            <div className="border-accent/20 flex items-center gap-2 border-b px-4 py-3">
                <span className="text-accent shrink-0 font-mono text-sm font-bold text-shadow-md">{">"}</span>
                <h2 className="text-accent m-0 font-mono text-sm font-bold text-shadow-md">{title}</h2>
            </div>
            <div className="flex flex-col gap-3 px-4 py-2">{children}</div>
            <div className="border-accent/20 text-accent/40 border-t px-4 py-2 font-mono text-xs">
                <span>↵ open</span>
            </div>
        </div>
    );
};
