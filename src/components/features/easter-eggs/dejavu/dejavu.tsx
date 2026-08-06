"use client";

import { FC, PropsWithChildren } from "react";
import { useDejavuStore } from "./use-dejavu-store";

export const DejavuEasterEgg: FC<PropsWithChildren> = ({ children }) => {
    const { effects } = useDejavuStore();
    const { handleLogoClick } = effects;

    return <div onClick={handleLogoClick}>{children}</div>;
};
