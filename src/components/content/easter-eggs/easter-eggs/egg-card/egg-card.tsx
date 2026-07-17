"use client";

import { FC } from "react";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { Cursor, QuoteText, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
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
            <Button onClick={onToggle} aria-expanded={revealed} className="w-fit mt-3">
                <span className="font-mono text-lg text-shadow-sm">
                    {">"} {revealed ? "hide" : "reveal"}
                    <Cursor />
                </span>
            </Button>
            {revealed && (
                <ol className="mt-3 list-decimal pl-6">
                    {hint.solutionSteps.map((step) => (
                        <li key={step} className="mb-2">
                            <TerminalLine>{step}</TerminalLine>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};
