import { TerminalItem } from "chicio-blog";
import { Command } from "cmdk";

const noop = () => undefined;

const Palette = ({ children }: { children: React.ReactNode }) => (
    <div className="glassmorphism-lite-no-scale w-full max-w-md overflow-hidden">
        <Command shouldFilter={false} className="flex flex-col">
            <Command.List className="py-2">{children}</Command.List>
        </Command>
    </div>
);

export const Default = () => (
    <Palette>
        <TerminalItem onSelect={noop} />
    </Palette>
);

export const InCommandList = () => (
    <Palette>
        <div className="text-accent px-4 py-1 font-mono text-xs tracking-wider uppercase">Actions</div>
        <TerminalItem onSelect={noop} />
    </Palette>
);
