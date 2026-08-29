import { FC } from "react";
import {
    TerminalButton as DesignSystemTerminalButton,
    type TerminalButtonProps,
} from "@/components/design-system/molecules/buttons/terminal-button";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { TerminalButtonProps };

/** TerminalButton bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const TerminalButton: FC<Omit<TerminalButtonProps, "linkComponent">> = (props) => (
    <DesignSystemTerminalButton {...props} linkComponent={NextLink} />
);
