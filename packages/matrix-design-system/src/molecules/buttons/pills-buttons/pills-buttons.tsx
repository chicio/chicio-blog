"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../../atoms/effects/pills";

type PillProps = PropsWithChildren<{
    onClick: () => void;
    disabled?: boolean;
}>;

export const RedPillButton: FC<PillProps> = ({ children, onClick, disabled }) => (
    <button className="cursor-pointer border-none bg-transparent p-0" onClick={onClick} disabled={disabled}>
        <RedPill>{children}</RedPill>
    </button>
);

export const BluePillButton: FC<PillProps> = ({ children, onClick, disabled }) => (
    <button className="cursor-pointer border-none bg-transparent p-0" onClick={onClick} disabled={disabled}>
        <BluePill>{children}</BluePill>
    </button>
);
