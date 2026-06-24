"use client";

import { FC } from "react";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { useGenericHeaderStore } from "./use-generic-header-store";

export interface ChatHeaderProps {
    title: string;
    subtitle: string;
    logo: React.ReactElement;
    visible?: boolean;
}

export const GenericHeader: FC<ChatHeaderProps> = ({ title, subtitle, logo, visible = true }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { effects } = useGenericHeaderStore();
    const { toggleSubtitle } = effects;

    if (!visible) {
        return null;
    }

    return (
        <div
            className={`${glassmorphismClass} text-center px-3 py-3 sm:px-5 sm:py-4 my-8 sm:my-12 mx-0 z-30`}
            onClick={toggleSubtitle}
        >
            <div className="flex flex-row items-center justify-center mb-1 sm:mb-2 gap-2 sm:gap-3">
                {logo}
                <h3>{title}</h3>
            </div>
            <p className="text-shadow-md text-center text-sm sm:text-base">{subtitle}</p>
        </div>
    );
};
