import { describe, it, expect } from "vitest";
import { completeInput, COMMAND_NAMES } from "./terminal-completion";
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
                "2024": { type: "dir", title: "2024", description: "Posts in 2024", children: {} },
                "2025": { type: "dir", title: "2025", description: "Posts in 2025", children: {} },
            },
        },
        "about-me": { type: "file", title: "About Me", description: "Bio", route: "/about-me" },
    },
};

describe("terminal-completion", () => {
    describe("completeInput", () => {
        it("returns all commands for an empty input", () => {
            expect(completeInput("", "/", fixtureRoot)).toEqual(COMMAND_NAMES);
        });

        it("completes a partial command name", () => {
            expect(completeInput("cl", "/", fixtureRoot)).toEqual(["clear"]);
        });

        it("returns no command completions once a full command plus space is typed with no matching path", () => {
            expect(completeInput("cd nope", "/", fixtureRoot)).toEqual([]);
        });

        it("completes a path argument against the cwd children", () => {
            expect(completeInput("cd bl", "/", fixtureRoot)).toEqual(["blog/"]);
        });

        it("completes all children when the argument token is empty (trailing space)", () => {
            expect(completeInput("ls ", "/", fixtureRoot)).toEqual(["about-me", "blog/"]);
        });

        it("completes nested path segments after a slash", () => {
            expect(completeInput("cd blog/20", "/", fixtureRoot)).toEqual(["blog/2024/", "blog/2025/"]);
        });

        it("suffixes directory completions with a trailing slash and leaves files unsuffixed", () => {
            const completions = completeInput("cat ", "/", fixtureRoot);
            expect(completions).toContain("about-me");
            expect(completions).toContain("blog/");
        });

        it("returns an empty array when completing a path under a non-existent directory", () => {
            expect(completeInput("cd nope/", "/", fixtureRoot)).toEqual([]);
        });
    });
});
