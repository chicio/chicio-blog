import { ChangeEvent, FC, FormEvent, KeyboardEvent } from "react";

export interface TerminalPromptProps {
    cwd: string;
    input: string;
    completions: string[];
    setInputElement: (el: HTMLInputElement | null) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleCompletionSelect: (completion: string) => () => void;
}

export const TerminalPrompt: FC<TerminalPromptProps> = ({
    cwd,
    input,
    completions,
    setInputElement,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    handleCompletionSelect,
}) => (
    <div className="border-accent/20 border-t px-4 py-3">
        {completions.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
                {completions.map((completion) => (
                    <button
                        key={completion}
                        type="button"
                        onClick={handleCompletionSelect(completion)}
                        className="border-accent/40 text-accent hover:bg-accent-alpha-10 rounded-full border px-2 py-0.5 font-mono text-xs transition-colors duration-100"
                    >
                        {completion}
                    </button>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="terminal-input" className="text-accent shrink-0 font-mono text-sm font-bold text-shadow-md">
                {cwd} $
            </label>
            <input
                id="terminal-input"
                ref={setInputElement}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="text-accent placeholder:text-accent/40 caret-accent flex-1 bg-transparent font-mono text-sm outline-none"
                placeholder="type a command_"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
            />
        </form>
    </div>
);
