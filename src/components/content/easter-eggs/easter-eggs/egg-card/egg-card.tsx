"use client";

import { FC } from "react";
import { TerminalButton } from "@/components/design-system/molecules/buttons/terminal-button";
import { QuoteText, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import type { EasterEggHint } from "@/lib/content/easter-eggs/easter-eggs-content";

interface EggCardProps {
    hint: EasterEggHint;
    revealed: boolean;
    onToggle: () => void;
}

export const EggCard: FC<EggCardProps> = ({ hint, revealed, onToggle }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`${glassmorphismClass} my-4 p-4 sm:p-6`}>
            <TerminalLine>
                {">"} {hint.title}
            </TerminalLine>
            <QuoteText>{hint.crypticHint}</QuoteText>
            <TerminalButton
                onClick={onToggle}
                ariaExpanded={revealed}
                label={revealed ? "hide" : "reveal"}
                className="mt-3"
            />
            {revealed && (
                <ul className="mt-3 list-disc pl-6">
                    {hint.solutionSteps.map((step) => (
                        <li key={step} className="mb-2">
                            <TerminalLine>{step}</TerminalLine>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
