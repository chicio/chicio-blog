"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";

type PillProps = PropsWithChildren<{
  onClick: () => void;
}>;

export const RedPillButton: FC<PillProps> = ({ children, onClick }) => (
  <button onClick={onClick}>
    <RedPill>{children}</RedPill>
  </button>
);

export const BluePillButton: FC<PillProps> = ({ children, onClick }) => (
  <button onClick={onClick}>
    <BluePill>{children}</BluePill>
  </button>
);