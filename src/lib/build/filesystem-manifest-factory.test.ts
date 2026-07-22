import { describe, it, expect } from "vitest";
import { generateFilesystemManifest } from "./filesystem-manifest-factory";
import { getAboutMe } from "@/lib/content/about-me/about-me";
import { getPosts } from "@/lib/content/posts/posts";
import { slugs } from "@/types/configuration/slug";
import type { TerminalDirNode } from "@/types/terminal/terminal";

describe("generateFilesystemManifest", () => {
    it("groups the top level of the tree into blog, dsa, videogames and the standalone leaf pages", () => {
        const { root } = generateFilesystemManifest();

        expect(Object.keys(root.children).sort()).toEqual(
            ["about-me", "art", "blog", "chat", "contact", "dsa", "videogames"].sort(),
        );
    });

    describe("blog subtree", () => {
        it("groups every post under its publish year, keyed by its slug", () => {
            const { root } = generateFilesystemManifest();
            const blog = root.children.blog as TerminalDirNode;
            const posts = getPosts();
            const firstPost = posts[0];
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
            const aboutMe = getAboutMe();

            expect(root.children["about-me"]).toMatchObject({
                type: "file",
                title: aboutMe.frontmatter.title,
                description: aboutMe.frontmatter.description,
                route: slugs.aboutMe,
            });
        });

        it("gives chat, art and contact their real routes so open can navigate to them", () => {
            const { root } = generateFilesystemManifest();

            expect(root.children.chat).toMatchObject({ type: "file", route: slugs.chat });
            expect(root.children.art).toMatchObject({ type: "file", route: slugs.art });
            expect(root.children.contact).toMatchObject({ type: "file", route: slugs.contact });
        });
    });
});
