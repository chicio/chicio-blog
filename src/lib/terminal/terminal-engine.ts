import { SearchablePostFields } from "@/types/search/search";
import { TerminalCommand, TerminalDirNode, TerminalExecutionResult, TerminalOutputLine } from "@/types/terminal/terminal";
import { findDir, findNode, resolvePath, ROOT_PATH } from "./terminal-path";

export const parse = (input: string): TerminalCommand => {
    const tokens = input.trim().split(/\s+/).filter((token) => token.length > 0);
    const [name = "", ...args] = tokens;

    return { name, args };
};

const FS_INDEPENDENT_COMMANDS = new Set(["", "help", "man", "pwd", "clear", "search"]);

export const needsFilesystem = (commandName: string): boolean => !FS_INDEPENDENT_COMMANDS.has(commandName);

const listChildrenNames = (dirNode: TerminalDirNode): string[] =>
    Object.keys(dirNode.children)
        .sort()
        .map((name) => `${name}${dirNode.children[name].type === "dir" ? "/" : ""}`);

const executeLs = (args: string[], cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    const targetPath = resolvePath(cwd, args[0] ?? "");
    const node = findNode(root, targetPath);

    if (!node) {
        return {
            lines: [{ text: `ls: ${args[0]}: no such file or directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `no such file or directory: ${args[0]}`,
        };
    }

    if (node.type === "file") {
        return { lines: [{ text: node.title }], newCwd: cwd, announcement: node.title };
    }

    const names = listChildrenNames(node);
    const label = targetPath === ROOT_PATH ? "/" : targetPath;

    return {
        lines: names.length > 0 ? names.map((name) => ({ text: name })) : [{ text: "(empty)" }],
        newCwd: cwd,
        announcement: `${label}: ${names.length} item${names.length === 1 ? "" : "s"}`,
    };
};

const executeCd = (args: string[], cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    const target = args[0] ?? "~";
    const targetPath = resolvePath(cwd, target);
    const node = findNode(root, targetPath);

    if (!node) {
        return {
            lines: [{ text: `cd: ${target}: no such file or directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `no such file or directory: ${target}`,
        };
    }

    if (node.type !== "dir") {
        return {
            lines: [{ text: `cd: ${target}: not a directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `not a directory: ${target}`,
        };
    }

    return { lines: [], newCwd: targetPath, announcement: `now in ${targetPath}` };
};

const buildTreeLines = (node: TerminalDirNode, prefix: string, lines: TerminalOutputLine[]): void => {
    const names = Object.keys(node.children).sort();

    names.forEach((name, index) => {
        const child = node.children[name];
        const isLast = index === names.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const label = child.type === "dir" ? `${name}/` : name;

        lines.push({ text: `${prefix}${connector}${label}` });

        if (child.type === "dir") {
            buildTreeLines(child, `${prefix}${isLast ? "    " : "│   "}`, lines);
        }
    });
};

const executeTree = (args: string[], cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    const targetPath = resolvePath(cwd, args[0] ?? "");
    const node = findDir(root, targetPath);

    if (!node) {
        return {
            lines: [{ text: `tree: ${args[0]}: no such directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `no such directory: ${args[0]}`,
        };
    }

    const lines: TerminalOutputLine[] = [{ text: targetPath === ROOT_PATH ? "/" : targetPath }];
    buildTreeLines(node, "", lines);

    return { lines, newCwd: cwd, announcement: `tree: ${lines.length - 1} entries` };
};

const executeCat = (args: string[], cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    if (!args[0]) {
        return { lines: [{ text: "cat: missing file operand", kind: "error" }], newCwd: cwd, announcement: "cat: missing file operand" };
    }

    const targetPath = resolvePath(cwd, args[0]);
    const node = findNode(root, targetPath);

    if (!node) {
        return {
            lines: [{ text: `cat: ${args[0]}: no such file or directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `no such file or directory: ${args[0]}`,
        };
    }

    if (!node.title) {
        return {
            lines: [{ text: `cat: ${args[0]}: is a directory`, kind: "error" }],
            newCwd: cwd,
            announcement: `is a directory: ${args[0]}`,
        };
    }

    const lines: TerminalOutputLine[] = [
        { text: node.title, kind: "success" },
        { text: node.description ?? "" },
    ];

    Object.entries(node.extra ?? {}).forEach(([key, value]) => {
        if (value) {
            lines.push({ text: `${key}: ${value}` });
        }
    });

    return { lines, newCwd: cwd, announcement: `showing ${node.title}` };
};

const executeOpen = (args: string[], cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    if (!args[0]) {
        return { lines: [{ text: "open: missing file operand", kind: "error" }], newCwd: cwd, announcement: "open: missing file operand" };
    }

    const targetPath = resolvePath(cwd, args[0]);
    const node = findNode(root, targetPath);

    if (!node || !node.route) {
        return {
            lines: [{ text: `open: ${args[0]}: nothing to open here`, kind: "error" }],
            newCwd: cwd,
            announcement: `nothing to open: ${args[0]}`,
        };
    }

    return {
        lines: [{ text: `opening ${node.title ?? args[0]}...`, kind: "success" }],
        newCwd: cwd,
        navigateTo: node.route,
        announcement: `navigating to ${node.title ?? args[0]}`,
    };
};

const COMMAND_HELP: Record<string, string> = {
    ls: "ls [path]         list directory contents",
    cd: "cd [path]         change directory (supports .. . ~ / and relative paths)",
    pwd: "pwd               print the current working directory",
    tree: "tree [path]       show the directory tree",
    cat: "cat <path>        show a concise preview of a page",
    open: "open <path>       navigate to the real page",
    help: "help              show this help message",
    man: "man <command>     show help for a single command",
    clear: "clear             clear the screen",
    search: "search <query>    search the site content",
};

const executeHelp = (args: string[], cwd: string): TerminalExecutionResult => {
    const command = args[0];

    if (command) {
        const help = COMMAND_HELP[command];

        return help
            ? { lines: [{ text: help }], newCwd: cwd, announcement: `help: ${command}` }
            : {
                  lines: [{ text: `man: no help for ${command}`, kind: "error" }],
                  newCwd: cwd,
                  announcement: `no help for ${command}`,
              };
    }

    return {
        lines: Object.values(COMMAND_HELP).map((text) => ({ text })),
        newCwd: cwd,
        announcement: `help: ${Object.keys(COMMAND_HELP).length} commands`,
    };
};

const executeSearch = (args: string[], cwd: string): TerminalExecutionResult => {
    const query = args.join(" ").trim();

    if (!query) {
        return { lines: [{ text: "search: missing query", kind: "error" }], newCwd: cwd, announcement: "search: missing query" };
    }

    return { lines: [{ text: `searching for "${query}"...` }], newCwd: cwd, searchQuery: query };
};

export const execute = (command: TerminalCommand, cwd: string, root: TerminalDirNode): TerminalExecutionResult => {
    const { name, args } = command;

    switch (name) {
        case "":
            return { lines: [], newCwd: cwd };
        case "pwd":
            return { lines: [{ text: cwd }], newCwd: cwd, announcement: cwd };
        case "clear":
            return { lines: [], newCwd: cwd, clearScreen: true };
        case "help":
        case "man":
            return executeHelp(args, cwd);
        case "ls":
            return executeLs(args, cwd, root);
        case "cd":
            return executeCd(args, cwd, root);
        case "tree":
            return executeTree(args, cwd, root);
        case "cat":
            return executeCat(args, cwd, root);
        case "open":
            return executeOpen(args, cwd, root);
        case "search":
            return executeSearch(args, cwd);
        default:
            return {
                lines: [
                    {
                        text: `command not found: ${name}. Type "help" for a list of commands.`,
                        kind: "error",
                    },
                ],
                newCwd: cwd,
                announcement: `command not found: ${name}`,
            };
    }
};

export const formatSearchResults = (
    query: string,
    results: SearchablePostFields[],
): { lines: TerminalOutputLine[]; announcement: string } => {
    if (results.length === 0) {
        return {
            lines: [{ text: `no results found for "${query}"`, kind: "error" }],
            announcement: `no results for ${query}`,
        };
    }

    const lines: TerminalOutputLine[] = results.flatMap((result) => [
        { text: `> ${result.title}`, kind: "success" as const },
        { text: `  ${result.description}` },
    ]);

    return {
        lines,
        announcement: `${results.length} result${results.length === 1 ? "" : "s"} for ${query}`,
    };
};
