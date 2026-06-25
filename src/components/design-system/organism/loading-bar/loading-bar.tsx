"use client";

import {
    Cursor,
    TerminalLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useLoadingBarStore } from "./use-loading-bar-store";

interface LoadingBarProps {
    message?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ message = "Processing..." }) => {
    const { state } = useLoadingBarStore();
    const { animatedBar } = state;

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <TerminalLine>
                {`> ${message}`} <Cursor />
            </TerminalLine>
            <TerminalLine>{animatedBar}</TerminalLine>
        </div>
    );
};
