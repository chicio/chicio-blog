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

export interface FoundNodeByRoute {
    path: string;
    node: TerminalNode;
}

const searchByRoute = (node: TerminalDirNode, route: string, segments: string[]): FoundNodeByRoute | null => {
    for (const name of Object.keys(node.children)) {
        const child = node.children[name];
        const childSegments = [...segments, name];

        if (child.route === route) {
            return { path: joinSegments(childSegments), node: child };
        }

        if (child.type === "dir") {
            const found = searchByRoute(child, route, childSegments);

            if (found) {
                return found;
            }
        }
    }

    return null;
};

/**
 * Reverse-looks-up a real site route to the terminal virtual filesystem node
 * that carries it (used to mirror browser Back/Forward into the shell: cwd +
 * rendered content follow whatever page the popstate landed on).
 */
export const findNodeByRoute = (root: TerminalDirNode, route: string): FoundNodeByRoute | null => {
    if (root.route === route) {
        return { path: ROOT_PATH, node: root };
    }

    return searchByRoute(root, route, []);
};

export interface PopstateTarget {
    path: string | null;
    title: string;
    route: string;
}

/**
 * Resolves the browser's current pathname (on a popstate event) to the
 * terminal's virtual cwd + a display title, for mirroring Back/Forward into
 * the shell. The homepage is special-cased since it is never itself a
 * manifest node (only its children carry explicit routes). A pathname with
 * no matching node (e.g. a page outside the virtual filesystem) still
 * resolves to a title/route pair so the content can be rendered — only the
 * cwd is left unset (`path: null`) since there is nowhere sensible to cd to.
 */
export const resolveRouteForPopstate = (root: TerminalDirNode, pathname: string): PopstateTarget => {
    if (pathname === ROOT_PATH) {
        return { path: ROOT_PATH, title: "home", route: ROOT_PATH };
    }

    const found = findNodeByRoute(root, pathname);

    if (found) {
        return { path: found.path, title: found.node.title ?? pathname, route: pathname };
    }

    return { path: null, title: pathname, route: pathname };
};
