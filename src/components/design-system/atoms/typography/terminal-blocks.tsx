import { FC, PropsWithChildren } from "react";

export const TerminalLine: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-shadow-md mb-2 font-mono font-bold leading-tight text-accent break-words text-xs sm:text-base">{children}</div>;
};

export const TerminalQuoteLine: FC<PropsWithChildren> = ({ children }) => {
  return <div className="my-2 leading-tight break-words text-xs sm:text-base text-center">{children}</div>;
};

export const Cursor: FC<PropsWithChildren> = () => <span className="animate-blink">_</span>;

export const ErrorText: FC<PropsWithChildren> = ({ children }) => <span className="text-confirm font-bold">{children}</span>;

export const SuccessText: FC<PropsWithChildren> = ({ children }) => <span className="text-accent text-shadow-md">{children}</span>; 

export const QuoteText: FC<PropsWithChildren> = ({ children }) => <span className="w-full text-center font-bold text-accent italic m-6 font-mono">{children}</span>;