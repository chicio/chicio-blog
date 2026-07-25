import { Content } from "@/types/content/content";
import { slugs } from "@/types/configuration/slug";
import { aboutMe } from "./about-me/about-me";
import {
    dsaExercisesList,
    dsaRoadmap,
    exercises,
    topics,
} from "./data-structures-and-algorithms/data-structures-and-algorithms";
import {
    dsaExerciseMarkdown,
    dsaExercisesListMarkdown,
    dsaMarkdown,
    dsaTopicMarkdown,
} from "./data-structures-and-algorithms/data-structures-and-algorithms-markdown";
import { easterEggHunt } from "./easter-eggs/easter-eggs";
import { posts } from "./posts/posts";
import { blogListingMarkdown, blogPostMarkdown, homepageMarkdown } from "./posts/posts-markdown";
import { consoles, games } from "./videogames/videogames";
import { consoleMarkdown, gameMarkdown, videogamesMarkdown } from "./videogames/videogames-markdown";
import { contactMarkdown } from "./contact/contact-markdown";
import { blogStatsMarkdown } from "@/lib/blog-stats/blog-stats-markdown";
import { mdxPageMarkdown } from "@/lib/mdx/mdx-page-markdown";

/**
 * One description of a routable piece of content, from which the subsystems that need to enumerate the
 * site are derived rather than restating it: the `/markdown` route's static params and dispatch, and
 * the search index.
 *
 * A single page and a collection share this one shape. A collection supplies `params` (every concrete
 * param set its `slug` template expands to); a page omits it, meaning the template expands to exactly
 * one path. `indexed` is omitted by anything that should not appear in site search.
 */
export interface ContentRegistryEntry {
    /** Route shape, with dynamic segments in brackets — see `slug-template.ts`. */
    slug: string;
    /** Every concrete param set for this slug. Omitted for a single page. */
    params?: () => Record<string, string>[];
    /** Markdown for one concrete path; returns null when that path has no content. */
    markdown: (params: Record<string, string>) => string | null;
    /** What this entry contributes to the search index. Omitted when it is not indexed. */
    indexed?: () => Content[];
}

const paramsOf = (section: { list: () => Content[] }) => () => section.list().map((item) => item.slug.params);

const singleItem = (section: { single: () => Content | undefined }) => () => {
    const content = section.single();

    return content ? [content] : [];
};

/**
 * Single pages come first so that an exact literal slug always wins over a collection template of the
 * same length (`/videogames/console/games` must not be read as a console named "games").
 */
export const contentRegistry: ContentRegistryEntry[] = [
    { slug: "/", markdown: homepageMarkdown },
    { slug: slugs.blog.home, markdown: blogListingMarkdown },
    { slug: slugs.blog.stats, markdown: blogStatsMarkdown },
    { slug: slugs.contact, markdown: contactMarkdown },
    { slug: slugs.aboutMe, markdown: () => mdxPageMarkdown(slugs.aboutMe), indexed: singleItem(aboutMe) },
    { slug: slugs.mcp, markdown: () => mdxPageMarkdown(slugs.mcp) },
    { slug: slugs.cookiePolicy, markdown: () => mdxPageMarkdown(slugs.cookiePolicy) },
    { slug: slugs.art, markdown: () => mdxPageMarkdown(slugs.art) },
    {
        slug: slugs.easterEggHunt,
        markdown: () => mdxPageMarkdown(slugs.easterEggHunt),
        indexed: singleItem(easterEggHunt),
    },
    { slug: slugs.dataStructuresAndAlgorithms.home, markdown: dsaMarkdown },
    {
        slug: slugs.dataStructuresAndAlgorithms.roadmap,
        markdown: () => mdxPageMarkdown(slugs.dataStructuresAndAlgorithms.roadmap),
        indexed: singleItem(dsaRoadmap),
    },
    {
        slug: slugs.dataStructuresAndAlgorithms.exercises,
        markdown: dsaExercisesListMarkdown,
        indexed: singleItem(dsaExercisesList),
    },
    { slug: slugs.videogames.home, markdown: videogamesMarkdown },
    {
        slug: slugs.blog.blogPost,
        params: paramsOf(posts),
        markdown: blogPostMarkdown,
        indexed: posts.list,
    },
    {
        slug: slugs.dataStructuresAndAlgorithms.topic,
        params: paramsOf(topics),
        markdown: dsaTopicMarkdown,
        indexed: topics.list,
    },
    {
        slug: slugs.dataStructuresAndAlgorithms.exercise,
        params: paramsOf(exercises),
        markdown: dsaExerciseMarkdown,
        indexed: exercises.list,
    },
    {
        slug: slugs.videogames.console,
        params: paramsOf(consoles),
        markdown: consoleMarkdown,
        indexed: consoles.list,
    },
    {
        slug: slugs.videogames.game,
        params: paramsOf(games),
        markdown: gameMarkdown,
        indexed: games.list,
    },
];
