import { FC } from "react";
import {
    Cursor,
    SuccessText,
    TerminalLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";

const getBar = (percentage: number, length = 24) => {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]  ${percentage}%`;
};

interface TerminalProgressBarProps {
    percentage: number;
    loadingMessage: string;
    completeMessage: string;
    shouldReduceMotion?: boolean;
}

export const TerminalProgressBar: FC<TerminalProgressBarProps> = ({
    percentage,
    loadingMessage,
    completeMessage,
    shouldReduceMotion = false,
}) => {
    const isComplete = percentage >= 100;

    return (
        <div className="flex flex-col items-center justify-center">
            <TerminalLine>
                {isComplete ? (
                    <SuccessText>{`> ${completeMessage}`}</SuccessText>
                ) : (
                    <>
                        {`> ${loadingMessage}`} {!shouldReduceMotion ? <Cursor /> : null}
                    </>
                )}
            </TerminalLine>
            <TerminalLine>
                <SuccessText>{getBar(percentage)}</SuccessText>
            </TerminalLine>
        </div>
    );
};
