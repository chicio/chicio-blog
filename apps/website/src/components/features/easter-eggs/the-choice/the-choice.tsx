"use client";

import { FC, PropsWithChildren } from "react";
import { useTheChoiceStore } from "./use-the-choice-store";

export const TheChoiceEasterEgg: FC<PropsWithChildren> = ({ children }) => {
    const { effects } = useTheChoiceStore();
    const { handleLogoClick } = effects;

    return <div onClick={handleLogoClick}>{children}</div>;
};
