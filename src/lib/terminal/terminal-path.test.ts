import { describe, it, expect } from "vitest";
import { findDir, findNode, findNodeByRoute, resolvePath, resolveRouteForPopstate, splitPath } from "./terminal-path";
import type { TerminalDirNode } from "@/types/terminal/terminal";

const fixtureRoot: TerminalDirNode = {
    type: "dir",
    children: {
        blog: {
            type: "dir",
            route: "/blog",
            title: "blog",
            description: "Blog posts",
            children: {
                "2024": {
                    type: "dir",
                    title: "2024",
                    description: "Posts in 2024",
                    children: {
                        "hello-world": {
                            type: "file",
                            title: "Hello World",
                            description: "First post",
                            route: "/blog/post/2024/01/01/hello-world",
                        },
                    },
                },
            },
        },
        "about-me": {
            type: "file",
            title: "About Me",
            description: "Bio",
            route: "/about-me",
        },
    },
};

describe("terminal-path", () => {
    describe("splitPath", () => {
        it("splits an absolute path into segments", () => {
            expect(splitPath("/blog/2024")).toEqual(["blog", "2024"]);
        });

        it("returns an empty array for the root path", () => {
            expect(splitPath("/")).toEqual([]);
        });
    });

    describe("resolvePath", () => {
        it("resolves a relative path against the cwd", () => {
            expect(resolvePath("/blog", "2024")).toBe("/blog/2024");
        });

        it("resolves an absolute path regardless of cwd", () => {
            expect(resolvePath("/blog/2024", "/about-me")).toBe("/about-me");
        });

        it("resolves .. to the parent directory", () => {
            expect(resolvePath("/blog/2024", "..")).toBe("/blog");
        });

        it("clamps .. at the root instead of going above it", () => {
            expect(resolvePath("/", "..")).toBe("/");
        });

        it("resolves . to the current directory", () => {
            expect(resolvePath("/blog", ".")).toBe("/blog");
        });

        it("resolves ~ to the root", () => {
            expect(resolvePath("/blog/2024", "~")).toBe("/");
        });

        it("resolves a ~/ prefixed path relative to the root", () => {
            expect(resolvePath("/blog/2024", "~/about-me")).toBe("/about-me");
        });

        it("returns the cwd unchanged when given an empty target", () => {
            expect(resolvePath("/blog", "")).toBe("/blog");
        });

        it("resolves nested relative segments combining . .. and directory names", () => {
            expect(resolvePath("/blog/2024", "../2024/./hello-world")).toBe("/blog/2024/hello-world");
        });
    });

    describe("findNode", () => {
        it("returns the root node for the root path", () => {
            expect(findNode(fixtureRoot, "/")).toBe(fixtureRoot);
        });

        it("finds a nested directory node", () => {
            const node = findNode(fixtureRoot, "/blog/2024");
            expect(node?.type).toBe("dir");
            expect(node?.title).toBe("2024");
        });

        it("finds a nested file node", () => {
            const node = findNode(fixtureRoot, "/blog/2024/hello-world");
            expect(node?.type).toBe("file");
            expect(node?.title).toBe("Hello World");
        });

        it("returns null for a path that does not exist", () => {
            expect(findNode(fixtureRoot, "/blog/2099")).toBeNull();
        });

        it("returns null when trying to traverse into a file as if it were a directory", () => {
            expect(findNode(fixtureRoot, "/about-me/nope")).toBeNull();
        });
    });

    describe("findDir", () => {
        it("returns the directory node when the path resolves to a dir", () => {
            expect(findDir(fixtureRoot, "/blog")?.title).toBe("blog");
        });

        it("returns null when the path resolves to a file", () => {
            expect(findDir(fixtureRoot, "/about-me")).toBeNull();
        });

        it("returns null when the path does not exist", () => {
            expect(findDir(fixtureRoot, "/nope")).toBeNull();
        });
    });

    describe("findNodeByRoute", () => {
        it("returns the root path when the route matches the root node itself", () => {
            const rootWithRoute: TerminalDirNode = { ...fixtureRoot, route: "/" };
            const found = findNodeByRoute(rootWithRoute, "/");
            expect(found?.path).toBe("/");
            expect(found?.node).toBe(rootWithRoute);
        });

        it("finds a top-level directory by its route", () => {
            const found = findNodeByRoute(fixtureRoot, "/blog");
            expect(found?.path).toBe("/blog");
            expect(found?.node.title).toBe("blog");
        });

        it("finds a deeply nested file by its route", () => {
            const found = findNodeByRoute(fixtureRoot, "/blog/post/2024/01/01/hello-world");
            expect(found?.path).toBe("/blog/2024/hello-world");
            expect(found?.node.title).toBe("Hello World");
        });

        it("returns null when no node carries the given route", () => {
            expect(findNodeByRoute(fixtureRoot, "/chat")).toBeNull();
        });
    });

    describe("resolveRouteForPopstate", () => {
        it("special-cases the homepage since it is never itself a manifest node", () => {
            expect(resolveRouteForPopstate(fixtureRoot, "/")).toEqual({ path: "/", title: "home", route: "/" });
        });

        it("special-cases the /terminal boot link the same way as the homepage", () => {
            expect(resolveRouteForPopstate(fixtureRoot, "/terminal")).toEqual({ path: "/", title: "home", route: "/" });
        });

        it("resolves cwd and title for a matched route", () => {
            expect(resolveRouteForPopstate(fixtureRoot, "/blog/post/2024/01/01/hello-world")).toEqual({
                path: "/blog/2024/hello-world",
                title: "Hello World",
                route: "/blog/post/2024/01/01/hello-world",
            });
        });

        it("falls back to a null path (no cwd change) for a route outside the manifest", () => {
            expect(resolveRouteForPopstate(fixtureRoot, "/chat")).toEqual({
                path: null,
                title: "/chat",
                route: "/chat",
            });
        });
    });
});
