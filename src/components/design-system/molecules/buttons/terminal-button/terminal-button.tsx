import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Cursor } from "@/components/design-system/atoms/typography/terminal-blocks";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { FC } from "react";

export interface TerminalButtonProps {
    label: string;
    to?: string;
    onClick?: () => void;
    className?: string;
    ariaExpanded?: boolean;
}

const TerminalContent: FC<{ label: string }> = ({ label }) => (
    <>
        {">"} {label}
        <Cursor />
    </>
);

export const TerminalButton: FC<TerminalButtonProps> = ({ label, to, onClick, className, ariaExpanded }) => {
    const buttonClassName = `w-fit${className ? ` ${className}` : ""}`;

    if (to) {
        return (
            <Button className={buttonClassName}>
                <InternalLink to={to} onClick={onClick} className="font-mono text-lg no-underline hover:no-underline">
                    <span className="text-shadow-sm">
                        <TerminalContent label={label} />
                    </span>
                </InternalLink>
            </Button>
        );
    }

    return (
        <Button onClick={onClick} aria-expanded={ariaExpanded} className={buttonClassName}>
            <span className="font-mono text-lg text-shadow-sm">
                <TerminalContent label={label} />
            </span>
        </Button>
    );
};
