import { describe, it, expect } from "vitest";
import { execute, formatSearchResults, parse } from "./terminal-engine";
import type { TerminalDirNode } from "@/types/terminal/terminal";
import type { SearchablePostFields } from "@/types/search/search";

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
                            extra: { date: "2024-01-01", tags: "react" },
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
        "grouping-only": {
            type: "dir",
            children: {
                child: { type: "file", title: "Child", description: "A child page", route: "/child" },
            },
        },
    },
};

describe("terminal-engine", () => {
    describe("parse", () => {
        it("splits a command and its arguments", () => {
            expect(parse("cd blog")).toEqual({ name: "cd", args: ["blog"] });
        });

        it("trims surrounding whitespace and collapses repeated spaces", () => {
            expect(parse("  ls   blog  ")).toEqual({ name: "ls", args: ["blog"] });
        });

        it("returns an empty command name for blank input", () => {
            expect(parse("   ")).toEqual({ name: "", args: [] });
        });

        it("supports multi-word arguments for commands like search", () => {
            expect(parse("search react native")).toEqual({ name: "search", args: ["react", "native"] });
        });
    });

    describe("execute", () => {
        describe("empty command", () => {
            it("returns no output and keeps the cwd unchanged", () => {
                const result = execute({ name: "", args: [] }, "/blog", fixtureRoot);
                expect(result).toEqual({ lines: [], newCwd: "/blog" });
            });
        });

        describe("pwd", () => {
            it("prints the current working directory", () => {
                const result = execute({ name: "pwd", args: [] }, "/blog/2024", fixtureRoot);
                expect(result.lines).toEqual([{ text: "/blog/2024" }]);
                expect(result.newCwd).toBe("/blog/2024");
            });
        });

        describe("clear", () => {
            it("clears the screen and returns no lines", () => {
                const result = execute({ name: "clear", args: [] }, "/", fixtureRoot);
                expect(result.clearScreen).toBe(true);
                expect(result.lines).toEqual([]);
            });
        });

        describe("ls", () => {
            it("lists the children of the cwd when no argument is given, suffixing dirs with /", () => {
                const result = execute({ name: "ls", args: [] }, "/", fixtureRoot);
                expect(result.lines.map((line) => line.text)).toEqual(["about-me", "blog/", "grouping-only/"]);
                expect(result.announcement).toBe("/: 3 items");
            });

            it("lists the children of an explicit path argument", () => {
                const result = execute({ name: "ls", args: ["blog"] }, "/", fixtureRoot);
                expect(result.lines.map((line) => line.text)).toEqual(["2024/"]);
            });

            it("prints (empty) for a directory with no children", () => {
                const emptyRoot: TerminalDirNode = { type: "dir", children: { empty: { type: "dir", children: {} } } };
                const result = execute({ name: "ls", args: ["empty"] }, "/", emptyRoot);
                expect(result.lines).toEqual([{ text: "(empty)" }]);
                expect(result.announcement).toBe("/empty: 0 items");
            });

            it("prints the title when targeting a file", () => {
                const result = execute({ name: "ls", args: ["about-me"] }, "/", fixtureRoot);
                expect(result.lines).toEqual([{ text: "About Me" }]);
            });

            it("errors with a status announcement for a non-existent path", () => {
                const result = execute({ name: "ls", args: ["nope"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.announcement).toBe("no such file or directory: nope");
                expect(result.newCwd).toBe("/");
            });
        });

        describe("cd", () => {
            it("changes the cwd to an existing directory", () => {
                const result = execute({ name: "cd", args: ["blog"] }, "/", fixtureRoot);
                expect(result.newCwd).toBe("/blog");
                expect(result.lines).toEqual([]);
            });

            it("navigates back up with ..", () => {
                const result = execute({ name: "cd", args: [".."] }, "/blog/2024", fixtureRoot);
                expect(result.newCwd).toBe("/blog");
            });

            it("goes to the root when called with no arguments", () => {
                const result = execute({ name: "cd", args: [] }, "/blog/2024", fixtureRoot);
                expect(result.newCwd).toBe("/");
            });

            it("goes to the root when called with ~", () => {
                const result = execute({ name: "cd", args: ["~"] }, "/blog/2024", fixtureRoot);
                expect(result.newCwd).toBe("/");
            });

            it("errors and keeps the cwd unchanged for a non-existent path", () => {
                const result = execute({ name: "cd", args: ["nope"] }, "/blog", fixtureRoot);
                expect(result.newCwd).toBe("/blog");
                expect(result.lines[0].kind).toBe("error");
                expect(result.announcement).toBe("no such file or directory: nope");
            });

            it("errors when targeting a file instead of a directory", () => {
                const result = execute({ name: "cd", args: ["about-me"] }, "/", fixtureRoot);
                expect(result.newCwd).toBe("/");
                expect(result.lines[0].kind).toBe("error");
                expect(result.announcement).toBe("not a directory: about-me");
            });
        });

        describe("tree", () => {
            it("renders a nested tree with unicode connectors", () => {
                const result = execute({ name: "tree", args: ["blog"] }, "/", fixtureRoot);
                expect(result.lines.map((line) => line.text)).toEqual([
                    "/blog",
                    "└── 2024/",
                    "    └── hello-world",
                ]);
            });

            it("errors for a non-existent directory", () => {
                const result = execute({ name: "tree", args: ["nope"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
            });
        });

        describe("cat", () => {
            it("prints the title, description and extra metadata of a file", () => {
                const result = execute({ name: "cat", args: ["blog/2024/hello-world"] }, "/", fixtureRoot);
                expect(result.lines).toEqual([
                    { text: "Hello World", kind: "success" },
                    { text: "First post" },
                    { text: "date: 2024-01-01" },
                    { text: "tags: react" },
                ]);
            });

            it("prints the title and description of a directory that carries content metadata", () => {
                const result = execute({ name: "cat", args: ["blog"] }, "/", fixtureRoot);
                expect(result.lines).toEqual([
                    { text: "blog", kind: "success" },
                    { text: "Blog posts" },
                ]);
            });

            it("errors for a pure grouping directory with no title/description", () => {
                const result = execute({ name: "cat", args: ["grouping-only"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.announcement).toBe("is a directory: grouping-only");
            });

            it("errors when no path is given", () => {
                const result = execute({ name: "cat", args: [] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
            });

            it("errors for a non-existent path", () => {
                const result = execute({ name: "cat", args: ["nope"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
            });
        });

        describe("open", () => {
            it("returns a navigateTo intent for a file with a route", () => {
                const result = execute({ name: "open", args: ["about-me"] }, "/", fixtureRoot);
                expect(result.navigateTo).toBe("/about-me");
                expect(result.announcement).toBe("navigating to About Me");
            });

            it("returns a navigateTo intent for a directory with a route", () => {
                const result = execute({ name: "open", args: ["blog"] }, "/", fixtureRoot);
                expect(result.navigateTo).toBe("/blog");
            });

            it("errors when no path is given", () => {
                const result = execute({ name: "open", args: [] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.navigateTo).toBeUndefined();
            });

            it("errors when the node has no route to open", () => {
                const result = execute({ name: "open", args: ["grouping-only"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.navigateTo).toBeUndefined();
            });

            it("errors for a non-existent path", () => {
                const result = execute({ name: "open", args: ["nope"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
            });
        });

        describe("help / man", () => {
            it("lists every command when called with no argument", () => {
                const result = execute({ name: "help", args: [] }, "/", fixtureRoot);
                expect(result.lines.length).toBeGreaterThan(5);
                expect(result.lines.some((line) => line.text.startsWith("ls "))).toBe(true);
            });

            it("man shows help for a single known command", () => {
                const result = execute({ name: "man", args: ["cd"] }, "/", fixtureRoot);
                expect(result.lines).toHaveLength(1);
                expect(result.lines[0].text).toContain("cd [path]");
            });

            it("errors for an unknown command name", () => {
                const result = execute({ name: "man", args: ["nope"] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
            });
        });

        describe("search", () => {
            it("acknowledges the query and signals the store to perform the actual search", () => {
                const result = execute({ name: "search", args: ["react", "native"] }, "/", fixtureRoot);
                expect(result.searchQuery).toBe("react native");
                expect(result.navigateTo).toBeUndefined();
            });

            it("errors when no query is given", () => {
                const result = execute({ name: "search", args: [] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.searchQuery).toBeUndefined();
            });
        });

        describe("unknown command", () => {
            it("returns an error line and a concise announcement", () => {
                const result = execute({ name: "sudo", args: [] }, "/", fixtureRoot);
                expect(result.lines[0].kind).toBe("error");
                expect(result.announcement).toBe("command not found: sudo");
                expect(result.newCwd).toBe("/");
            });
        });
    });

    describe("formatSearchResults", () => {
        const results: SearchablePostFields[] = [
            { slug: "/blog/post/2024/01/01/a", title: "Post A", description: "About A", tags: [], authors: [] },
            { slug: "/blog/post/2024/01/02/b", title: "Post B", description: "About B", tags: [], authors: [] },
        ];

        it("formats each result as a title and description line", () => {
            const { lines, announcement } = formatSearchResults("react", results);
            expect(lines).toEqual([
                { text: "> Post A", kind: "success" },
                { text: "  About A" },
                { text: "> Post B", kind: "success" },
                { text: "  About B" },
            ]);
            expect(announcement).toBe("2 results for react");
        });

        it("uses singular wording for a single result", () => {
            const { announcement } = formatSearchResults("react", [results[0]]);
            expect(announcement).toBe("1 result for react");
        });

        it("returns an error line when there are no results", () => {
            const { lines, announcement } = formatSearchResults("nope", []);
            expect(lines[0].kind).toBe("error");
            expect(announcement).toBe("no results for nope");
        });
    });
});
