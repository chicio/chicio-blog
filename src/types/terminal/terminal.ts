export interface TerminalFileNode {
    type: "file";
    title: string;
    description: string;
    route: string;
    extra?: Record<string, string>;
}

export interface TerminalDirNode {
    type: "dir";
    title?: string;
    description?: string;
    route?: string;
    extra?: Record<string, string>;
    children: Record<string, TerminalNode>;
}

export type TerminalNode = TerminalFileNode | TerminalDirNode;

export interface TerminalFileSystemManifest {
    root: TerminalDirNode;
}

export interface TerminalOutputLine {
    text: string;
    kind?: "normal" | "error" | "success";
}

export interface TerminalCommand {
    name: string;
    args: string[];
}

export interface TerminalExecutionResult {
    lines: TerminalOutputLine[];
    newCwd: string;
    navigateTo?: string;
    clearScreen?: boolean;
    announcement?: string;
    searchQuery?: string;
}
