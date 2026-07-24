import { getAboutMe } from "@/lib/content/about-me/about-me";
import {
    getAllDataStructuresAndAlgorithmsTopics,
    getAllExercises,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { getPosts } from "@/lib/content/posts/posts";
import { getAllConsoles, getAllGames } from "@/lib/content/videogames/videogames";
import { slugs } from "@/types/configuration/slug";
import { Content } from "@/types/content/content";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { TerminalDirNode, TerminalFileNode, TerminalFileSystemManifest } from "@/types/terminal/terminal";

const dir = (partial: Partial<TerminalDirNode> = {}): TerminalDirNode => ({
    type: "dir",
    children: {},
    ...partial,
});

const file = (
    title: string,
    description: string,
    route: string,
    extra?: Record<string, string>,
): TerminalFileNode => ({
    type: "file",
    title,
    description,
    route,
    ...(extra ? { extra } : {}),
});

const buildBlogTree = (posts: Content[]): TerminalDirNode => {
    const blog = dir({
        route: slugs.blog.home,
        title: "blog",
        description: "Blog posts about software engineering, AI and more",
    });

    posts.forEach((post) => {
        const year = post.slug.params.year;
        const slug = post.slug.params.slug;

        if (!blog.children[year]) {
            blog.children[year] = dir({ title: year, description: `Posts published in ${year}` });
        }

        (blog.children[year] as TerminalDirNode).children[slug] = file(
            post.frontmatter.title,
            post.frontmatter.description,
            post.slug.formatted,
            { date: post.frontmatter.date.formatted, tags: post.frontmatter.tags.join(", ") },
        );
    });

    return blog;
};

const buildDsaTree = (topics: Content[], exercises: Content<ExerciseMetadata>[]): TerminalDirNode => {
    const dsa = dir({
        route: slugs.dataStructuresAndAlgorithms.home,
        title: "dsa",
        description: "Data structures and algorithms roadmap and exercises",
    });

    topics.forEach((topic) => {
        const topicSlug = topic.slug.params.topic;

        dsa.children[topicSlug] = dir({
            route: topic.slug.formatted,
            title: topic.frontmatter.title,
            description: topic.frontmatter.description,
            children: {},
        });
    });

    exercises.forEach((exercise) => {
        const topicSlug = exercise.slug.params.topic;
        const exerciseSlug = exercise.slug.params.exercise;
        const topicDir = dsa.children[topicSlug] as TerminalDirNode | undefined;

        if (!topicDir) {
            return;
        }

        topicDir.children[exerciseSlug] = file(
            exercise.frontmatter.title,
            exercise.frontmatter.description,
            exercise.slug.formatted,
            {
                technique: exercise.frontmatter.metadata?.technique ?? "",
                difficulty: exercise.frontmatter.metadata?.difficulty ?? "",
            },
        );
    });

    return dsa;
};

const buildVideogamesTree = (
    consoles: Content<ConsoleMetadata>[],
    games: Content<GameMetadata>[],
): TerminalDirNode => {
    const videogames = dir({
        route: slugs.videogames.home,
        title: "videogames",
        description: "Fabrizio's videogame console and game collection",
    });

    consoles.forEach((console) => {
        const consoleSlug = console.slug.params.console;

        videogames.children[consoleSlug] = dir({
            route: console.slug.formatted,
            title: console.frontmatter.title,
            description: console.frontmatter.description,
            children: {},
        });
    });

    games.forEach((game) => {
        const consoleSlug = game.slug.params.console;
        const gameSlug = game.slug.params.game;
        const consoleDir = videogames.children[consoleSlug] as TerminalDirNode | undefined;

        if (!consoleDir) {
            return;
        }

        consoleDir.children[gameSlug] = file(game.frontmatter.title, game.frontmatter.description, game.slug.formatted, {
            releaseYear: game.frontmatter.metadata?.releaseYear ?? "",
            genre: game.frontmatter.metadata?.genre ?? "",
        });
    });

    return videogames;
};

export const generateFilesystemManifest = (): TerminalFileSystemManifest => {
    const aboutMe = getAboutMe();

    const root = dir({
        children: {
            blog: buildBlogTree(getPosts()),
            dsa: buildDsaTree(getAllDataStructuresAndAlgorithmsTopics(), getAllExercises()),
            videogames: buildVideogamesTree(getAllConsoles(), getAllGames()),
            "about-me": file(aboutMe.frontmatter.title, aboutMe.frontmatter.description, slugs.aboutMe),
            art: file("Art", "3D and generative art gallery", slugs.art),
            chat: file("Chat", "Chat with Fabrizio's AI assistant", slugs.chat),
            contact: file("Contact", "Send Fabrizio a message", slugs.contact),
            mcp: file("MCP", "MCP server for AI assistants", slugs.mcp),
            "cookie-policy": file("Cookie Policy", "How this site uses cookies", slugs.cookiePolicy),
        },
    });

    return { root };
};
