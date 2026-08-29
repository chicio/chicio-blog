import { FC } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";

export interface TerminalListItemProps {
    title: string;
    description: string;
}

export const TerminalListItem: FC<TerminalListItemProps> = ({ title, description }) => (
    <>
        <TerminalLine>
            {">"} {title}
        </TerminalLine>
        <p className="text-primary-text/60 ml-4 line-clamp-1 font-mono text-xs leading-tight">{description}</p>
    </>
);
