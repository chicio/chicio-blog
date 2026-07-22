import { TerminalDirNode } from "@/types/terminal/terminal";
import { findDir, resolvePath } from "./terminal-path";

export const COMMAND_NAMES = ["ls", "cd", "pwd", "tree", "cat", "open", "help", "man", "clear", "search"];

const completePathToken = (partial: string, cwd: string, root: TerminalDirNode): string[] => {
    const lastSlashIndex = partial.lastIndexOf("/");
    const dirPart = lastSlashIndex === -1 ? "" : partial.slice(0, lastSlashIndex + 1);
    const namePart = lastSlashIndex === -1 ? partial : partial.slice(lastSlashIndex + 1);
    const targetDirPath = dirPart === "" ? cwd : resolvePath(cwd, dirPart);
    const dirNode = findDir(root, targetDirPath);

    if (!dirNode) {
        return [];
    }

    return Object.keys(dirNode.children)
        .filter((name) => name.startsWith(namePart))
        .sort()
        .map((name) => `${dirPart}${name}${dirNode.children[name].type === "dir" ? "/" : ""}`);
};

export const completeInput = (input: string, cwd: string, root: TerminalDirNode): string[] => {
    const hasTrailingSpace = /\s$/.test(input);
    const tokens = input.trimStart().split(/\s+/).filter((token) => token.length > 0);

    if (tokens.length === 0) {
        return [...COMMAND_NAMES];
    }

    if (tokens.length === 1 && !hasTrailingSpace) {
        return COMMAND_NAMES.filter((command) => command.startsWith(tokens[0]));
    }

    const partial = hasTrailingSpace ? "" : tokens[tokens.length - 1];

    return completePathToken(partial, cwd, root);
};
