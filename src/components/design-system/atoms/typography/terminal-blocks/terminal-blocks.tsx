import { FC, PropsWithChildren } from "react";

export type TerminalLineSize = "sm" | "lg";

/**
 * Expressed as a lookup rather than an appended `className` because the two sets are both font-size
 * utilities: which one wins would come down to their order in the generated stylesheet, not to the
 * order they are written in. There is no tailwind-merge in this project to arbitrate that.
 */
const TERMINAL_LINE_SIZE_CLASS: Record<TerminalLineSize, string> = {
    sm: "text-xs sm:text-sm",
    lg: "text-base sm:text-lg",
};

export const TerminalLine: FC<PropsWithChildren<{ size?: TerminalLineSize }>> = ({ children, size = "sm" }) => {
    return (
        <div
            className={`text-shadow-md mb-2 font-mono font-bold leading-tight text-accent break-words ${TERMINAL_LINE_SIZE_CLASS[size]}`}
        >
            {children}
        </div>
    );
};

export const TerminalQuoteLine: FC<PropsWithChildren> = ({ children }) => {
    return <div className="my-2 leading-tight break-words text-xs sm:text-sm text-center">{children}</div>;
};

export const Cursor: FC<PropsWithChildren> = () => <span className="animate-blink">_</span>;

export const ErrorText: FC<PropsWithChildren> = ({ children }) => (
    <span className="text-confirm font-bold">{children}</span>
);

export const SuccessText: FC<PropsWithChildren> = ({ children }) => (
    <span className="text-accent text-shadow-md">{children}</span>
);

export const QuoteText: FC<PropsWithChildren> = ({ children }) => (
    <span className="w-full text-center font-bold text-accent italic m-6 font-mono">{children}</span>
);
