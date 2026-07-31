import { describe, it, expect, beforeAll } from "vitest";
import { generateFilesystemManifest } from "./filesystem-manifest-factory";
import { aboutMe } from "@/lib/content/about-me/about-me";
import { posts } from "@/lib/content/posts/posts";
import { slugs } from "@/types/configuration/slug";
import type { TerminalDirNode } from "@/types/terminal/terminal";

describe("generateFilesystemManifest", () => {
    // Warms `extractHeadings`'s module-level memo (see `headings.ts`) for the whole ~550-file content tree
    // before any assertion runs. `generateFilesystemManifest()` walks every content item, and outside
    // `NODE_ENV === "production"` the `cached()` build helper it goes through is a deliberate no-op, so the
    // FIRST call in this file always pays the full, unmemoized AST-parse cost once. Paying that cost here,
    // with its own generous hook timeout, means no individual `it()` below — including the very first —
    // ever risks the default 5s test timeout under coverage instrumentation on a loaded runner; every one of
    // them calls `generateFilesystemManifest()` again themselves, now served entirely from the warm cache.
    beforeAll(() => {
        generateFilesystemManifest();
    }, 15000);

    it("groups the top level of the tree into blog, dsa, videogames and the standalone leaf pages", () => {
        const { root } = generateFilesystemManifest();

        expect(Object.keys(root.children).sort()).toEqual(
            [
                "about-me",
                "art",
                "blog",
                "chat",
                "contact",
                "cookie-policy",
                "dsa",
                "easter-egg-hunt",
                "mcp",
                "videogames",
            ].sort(),
        );
    });

    describe("blog subtree", () => {
        it("groups every post under its publish year, keyed by its slug", () => {
            const { root } = generateFilesystemManifest();
            const blog = root.children.blog as TerminalDirNode;
            const allPosts = posts.list();
            const firstPost = allPosts[0];
            const year = firstPost.slug.params.year;
            const yearDir = blog.children[year] as TerminalDirNode;

            expect(yearDir.type).toBe("dir");
            expect(yearDir.children[firstPost.slug.params.slug]).toMatchObject({
                type: "file",
                title: firstPost.frontmatter.title,
                route: firstPost.slug.formatted,
            });
        });

        it("carries the real blog home route on the blog directory itself", () => {
            const { root } = generateFilesystemManifest();
            const blog = root.children.blog as TerminalDirNode;

            expect(blog.route).toBe(slugs.blog.home);
        });
    });

    describe("dsa subtree", () => {
        it("nests exercises under their topic directory", () => {
            const { root } = generateFilesystemManifest();
            const dsa = root.children.dsa as TerminalDirNode;
            const topicNames = Object.keys(dsa.children);

            expect(topicNames.length).toBeGreaterThan(0);

            const topicWithExercises = topicNames.find((name) => {
                const topic = dsa.children[name] as TerminalDirNode;
                return Object.keys(topic.children).length > 0;
            });

            expect(topicWithExercises).toBeDefined();
        });
    });

    describe("videogames subtree", () => {
        it("nests games under their console directory", () => {
            const { root } = generateFilesystemManifest();
            const videogames = root.children.videogames as TerminalDirNode;
            const consoleNames = Object.keys(videogames.children);

            expect(consoleNames.length).toBeGreaterThan(0);

            const consoleWithGames = consoleNames.find((name) => {
                const console = videogames.children[name] as TerminalDirNode;
                return Object.keys(console.children).length > 0;
            });

            expect(consoleWithGames).toBeDefined();
        });
    });

    describe("standalone leaf pages", () => {
        it("uses the real about-me content for the about-me leaf", () => {
            const { root } = generateFilesystemManifest();
            const aboutMeContent = aboutMe.single()!;

            expect(root.children["about-me"]).toMatchObject({
                type: "file",
                title: aboutMeContent.frontmatter.title,
                description: aboutMeContent.frontmatter.description,
                route: slugs.aboutMe,
            });
        });

        it("gives chat, art, contact, mcp and cookie-policy their real routes so open can navigate to them", () => {
            const { root } = generateFilesystemManifest();

            expect(root.children.chat).toMatchObject({ type: "file", route: slugs.chat });
            expect(root.children.art).toMatchObject({ type: "file", route: slugs.art });
            expect(root.children.contact).toMatchObject({ type: "file", route: slugs.contact });
            expect(root.children.mcp).toMatchObject({ type: "file", route: slugs.mcp });
            expect(root.children["cookie-policy"]).toMatchObject({ type: "file", route: slugs.cookiePolicy });
        });
    });
});
