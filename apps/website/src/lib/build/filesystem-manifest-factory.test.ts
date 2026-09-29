import { describe, it, expect } from "vitest";
import { generateFilesystemManifest } from "./filesystem-manifest-factory";
import { aboutMe } from "@/lib/content/about-me/about-me";
import { art } from "@/lib/content/art/art";
import { mangas } from "@/lib/content/manga/manga";
import { posts } from "@/lib/content/posts/posts";
import { slugs } from "@/types/configuration/slug";
import type { TerminalDirNode } from "@/types/terminal/terminal";

describe("generateFilesystemManifest", () => {
    it("groups the top level of the tree into blog, dsa, videogames, manga and the standalone leaf pages", () => {
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
                "manga",
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

    describe("manga subtree", () => {
        it("lists every manga as a leaf keyed by its slug, with the real route to open", () => {
            const { root } = generateFilesystemManifest();
            const manga = root.children.manga as TerminalDirNode;
            const allManga = mangas.list();

            expect(manga.route).toBe(slugs.manga.home);
            expect(Object.keys(manga.children).sort()).toEqual(allManga.map((item) => item.slug.params.manga).sort());
            expect(manga.children[allManga[0].slug.params.manga]).toMatchObject({
                type: "file",
                title: allManga[0].frontmatter.title,
                route: allManga[0].slug.formatted,
            });
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

        it("describes Art from its own frontmatter, not as a 3D or generative gallery", () => {
            const { root } = generateFilesystemManifest();
            const artContent = art.single()!;

            expect(root.children.art).toMatchObject({
                type: "file",
                title: artContent.frontmatter.title,
                description: artContent.frontmatter.description,
                route: slugs.art,
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
