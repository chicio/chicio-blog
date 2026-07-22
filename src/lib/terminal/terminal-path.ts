import { TerminalDirNode, TerminalNode } from "@/types/terminal/terminal";

export const ROOT_PATH = "/";

export const splitPath = (targetPath: string): string[] => targetPath.split("/").filter((segment) => segment.length > 0);

export const joinSegments = (segments: string[]): string => (segments.length === 0 ? ROOT_PATH : `/${segments.join("/")}`);

export const resolvePath = (cwd: string, target: string): string => {
    if (target === "" || target === undefined) {
        return cwd;
    }

    if (target === "~") {
        return ROOT_PATH;
    }

    const startingSegments = target.startsWith("/") || target.startsWith("~/") ? [] : splitPath(cwd);
    const targetWithoutHome = target.startsWith("~/") ? target.slice(2) : target;
    const segments = [...startingSegments];

    splitPath(targetWithoutHome).forEach((segment) => {
        if (segment === ".") {
            return;
        }

        if (segment === "..") {
            segments.pop();
            return;
        }

        segments.push(segment);
    });

    return joinSegments(segments);
};

export const findNode = (root: TerminalDirNode, targetPath: string): TerminalNode | null => {
    const segments = splitPath(targetPath);
    let current: TerminalNode = root;

    for (const segment of segments) {
        if (current.type !== "dir") {
            return null;
        }

        const next: TerminalNode | undefined = current.children[segment];

        if (!next) {
            return null;
        }

        current = next;
    }

    return current;
};

export const findDir = (root: TerminalDirNode, targetPath: string): TerminalDirNode | null => {
    const node = findNode(root, targetPath);
    return node && node.type === "dir" ? node : null;
};
