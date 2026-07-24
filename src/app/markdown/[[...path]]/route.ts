import { contactMarkdown } from "@/lib/content/contact/contact-markdown";
import { easterEggHuntMarkdown } from "@/lib/content/easter-eggs/easter-egg-hunt-markdown";
import {
    dsaExerciseMarkdown,
    dsaExercisesListMarkdown,
    dsaMarkdown,
    dsaRoadmapMarkdown,
    dsaTopicMarkdown,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms-markdown";
import {
    topics,
    exercises,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { blogListingMarkdown, blogPostMarkdown, homepageMarkdown } from "@/lib/content/posts/posts-markdown";
import { posts } from "@/lib/content/posts/posts";
import { blogStatsMarkdown } from "@/lib/blog-stats/blog-stats-markdown";
import { mdxPageMarkdown } from "@/lib/mdx/mdx-page-markdown";
import { consoleMarkdown, gameMarkdown, videogamesMarkdown } from "@/lib/content/videogames/videogames-markdown";
import { consoles, games } from "@/lib/content/videogames/videogames";
import { slugs } from "@/types/configuration/slug";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const blogPostPrefix = slugs.blog.blogPost.split("/").slice(1, 3);
const dsaTopicPrefix = slugs.dataStructuresAndAlgorithms.topic.split("/").slice(1, 3);
const dsaExercisePrefix = slugs.dataStructuresAndAlgorithms.exercise.split("/").slice(1, 3);
const videogameConsolePrefix = slugs.videogames.console.split("/").slice(1, 3);
const videogameGamePrefix = slugs.videogames.game.split("/").slice(1, 3);

// Pages backed by a standard src/content/<slug>/content.mdx file — mdxPageMarkdown is fully
// generic over the slug, so this registry replaces what would otherwise be one switch arm (and
// one bespoke generator function) per page.
const MDX_PAGE_SLUGS = new Set<string>([slugs.aboutMe, slugs.mcp, slugs.cookiePolicy, slugs.art]);

export async function generateStaticParams() {
    const postParams = posts.list().map((post) => ({
        path: [...blogPostPrefix, post.slug.params.year, post.slug.params.month, post.slug.params.day, post.slug.params.slug],
    }));

    const dsaTopicParams = topics.list().map((topic) => ({
        path: [...dsaTopicPrefix, topic.slug.params.topic],
    }));

    const dsaExerciseParams = exercises.list().map((exercise) => ({
        path: [...dsaExercisePrefix, exercise.slug.params.topic, "exercise", exercise.slug.params.exercise],
    }));

    const consoleParams = consoles.list().map((c) => ({
        path: [...videogameConsolePrefix, c.slug.params.console],
    }));

    const gameParams = games.list().map((g) => ({
        path: [...videogameGamePrefix, g.slug.params.console, "game", g.slug.params.game],
    }));

    return [
        { path: undefined },
        { path: slugs.blog.home.slice(1).split("/") },
        { path: slugs.blog.stats.slice(1).split("/") },
        { path: slugs.aboutMe.slice(1).split("/") },
        { path: slugs.mcp.slice(1).split("/") },
        { path: slugs.cookiePolicy.slice(1).split("/") },
        { path: slugs.art.slice(1).split("/") },
        { path: slugs.contact.slice(1).split("/") },
        { path: slugs.easterEggHunt.slice(1).split("/") },
        { path: slugs.dataStructuresAndAlgorithms.home.slice(1).split("/") },
        { path: slugs.dataStructuresAndAlgorithms.roadmap.slice(1).split("/") },
        { path: slugs.dataStructuresAndAlgorithms.exercises.slice(1).split("/") },
        { path: slugs.videogames.home.slice(1).split("/") },
        ...postParams,
        ...dsaTopicParams,
        ...dsaExerciseParams,
        ...consoleParams,
        ...gameParams,
    ];
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

type RouteContext = { params: Promise<{ path?: string[] }> };

export async function GET(_request: Request, { params }: RouteContext) {
    const { path = [] } = await params;
    const joinedPath = `/${path.join("/")}`;

    let markdown: string | null = null;

    if (MDX_PAGE_SLUGS.has(joinedPath)) {
        markdown = mdxPageMarkdown(joinedPath);
    } else {
        switch (joinedPath) {
            case "/":
                markdown = homepageMarkdown();
                break;
            case slugs.blog.home:
                markdown = blogListingMarkdown();
                break;
            case slugs.blog.stats:
                markdown = blogStatsMarkdown();
                break;
            case slugs.contact:
                markdown = contactMarkdown();
                break;
            case slugs.easterEggHunt:
                markdown = easterEggHuntMarkdown();
                break;
            case slugs.dataStructuresAndAlgorithms.home:
                markdown = dsaMarkdown();
                break;
            case slugs.dataStructuresAndAlgorithms.roadmap:
                markdown = dsaRoadmapMarkdown();
                break;
            case slugs.dataStructuresAndAlgorithms.exercises:
                markdown = dsaExercisesListMarkdown();
                break;
            case slugs.videogames.home:
                markdown = videogamesMarkdown();
                break;
            default: {
                if (path.length === 6 && path[0] === blogPostPrefix[0] && path[1] === blogPostPrefix[1]) {
                    const [, , year, month, day, slug] = path;
                    markdown = blogPostMarkdown({ year, month, day, slug });
                } else if (path.length === 3 && path[0] === dsaTopicPrefix[0] && path[1] === dsaTopicPrefix[1]) {
                    markdown = dsaTopicMarkdown({ topic: path[2] });
                } else if (path.length === 5 && path[0] === dsaExercisePrefix[0] && path[1] === dsaExercisePrefix[1]) {
                    markdown = dsaExerciseMarkdown({ topic: path[2], exercise: path[4] });
                } else if (
                    path.length === 3 &&
                    path[0] === videogameConsolePrefix[0] &&
                    path[1] === videogameConsolePrefix[1]
                ) {
                    markdown = consoleMarkdown({ console: path[2] });
                } else if (
                    path.length === 5 &&
                    path[0] === videogameGamePrefix[0] &&
                    path[1] === videogameGamePrefix[1]
                ) {
                    markdown = gameMarkdown({ console: path[2], game: path[4] });
                }
            }
        }
    }

    if (!markdown) {
        notFound();
    }

    return new Response(markdown, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(markdown)),
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
