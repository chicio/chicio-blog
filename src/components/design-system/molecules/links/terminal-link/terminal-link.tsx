import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Cursor } from "@/components/design-system/atoms/typography/terminal-blocks";
import { Button } from "@/components/design-system/atoms/buttons/button";
import React from "react";

export const TerminalLink: React.FC<{
    to: string;
    onClick?: () => void;
    label: string;
    className?: string;
}> = ({ to, onClick, label, className }) => (
    <Button className={`w-fit${className ? ` ${className}` : ""}`}>
        <InternalLink
            to={to}
            onClick={onClick}
            className="font-mono text-lg no-underline hover:no-underline"
        >
            <span className="text-shadow-sm">
                {">"} {label}
                <Cursor />
            </span>
        </InternalLink>
    </Button>
);
