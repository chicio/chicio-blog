import type { ReactNode } from "react";
import { Chip, ReadingContentPageTemplate } from "chicio-blog";

// The header, the footer and TerminalButton all embed Cursor (animate-blink: opacity 1 for 0-50%,
// 0 for 51-100%). package-capture screenshots after networkidle with no animation control, so the
// caret lands present or absent at random. An animation created paused sits at its 0% keyframe,
// which is the visible half of the blink.
const Still = ({ children }: { children: ReactNode }) => (
    <>
        <style>{`.ds-blink-still, .ds-blink-still * { animation-play-state: paused !important; }`}</style>
        <div className="ds-blink-still">{children}</div>
    </>
);

const navHrefs = {
    blog: "/blog",
    blogAuthors: "/blog/authors",
    blogAuthor: "/blog/author",
    blogTags: "/blog/tags",
    blogArchive: "/blog/archive",
    blogStats: "/blog/stats",
    dsaRoadmap: "/data-structures-and-algorithms/roadmap",
    dsaExercises: "/data-structures-and-algorithms/exercises",
    chat: "/chat",
    mcp: "/mcp",
    easterEggHunt: "/easter-egg-hunt",
    aboutMe: "/about-me",
    art: "/art",
    videogames: "/videogames",
    contact: "/contact",
};

const footerNavHrefs = {
    blog: "/blog",
    art: "/art",
    aboutMe: "/about-me",
    archive: "/blog/archive",
    tags: "/blog/tags",
    contact: "/contact",
};

const socialLinks = {
    github: "https://github.com/chicio",
    linkedin: "https://www.linkedin.com/in/fabrizio-duroni/",
    medium: "https://medium.com/@chicio",
    devto: "https://dev.to/chicio",
    twitter: "https://twitter.com/chicio86",
    facebook: "https://www.facebook.com/fabrizio.duroni/",
    instagram: "https://www.instagram.com/__chicio__/",
};

const postTitle = "Build your own MCP server to expose your blog to AI agents";

export const BlogPost = () => (
    <Still>
        <ReadingContentPageTemplate
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
            breadcrumbs={[
                { label: "Blog", href: "/blog", isCurrent: false },
                { label: postTitle, href: "/blog", isCurrent: true },
            ]}
            beforeContent={
                <>
                    <h1 className="leading-tight">{postTitle}</h1>
                    <div className="flex flex-row gap-3">
                        <time>01 May 2026</time>
                        <span className="text-secondary-text">9 min read</span>
                    </div>
                </>
            }
            afterContent={
                <div className="mt-6 flex flex-wrap gap-2">
                    <Chip>mcp</Chip>
                    <Chip>ai</Chip>
                    <Chip>typescript</Chip>
                </div>
            }
        >
            <h2>What is the Model Context Protocol</h2>
            <p>
                MCP is an open protocol that lets an AI assistant discover and call tools exposed by a server. Instead of
                scraping the HTML of my blog, an agent can ask for the list of posts, the tags, or the full text of a single
                article, and get back structured JSON.
            </p>
            <p>
                The server I built exposes ten tools, all of them backed by the same filesystem-as-database content layer
                that renders the site itself, so there is exactly one source of truth.
            </p>
            <h2>Exposing the content</h2>
            <ul>
                <li>Every post already carries frontmatter, so the tool schema writes itself.</li>
                <li>The search index is generated at build time and reused by the search tool.</li>
            </ul>
        </ReadingContentPageTemplate>
    </Still>
);

export const DsaExercise = () => (
    <Still>
        <ReadingContentPageTemplate
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
            breadcrumbs={[
                { label: "DSA", href: "/data-structures-and-algorithms/roadmap", isCurrent: false },
                { label: "Graph", href: "/data-structures-and-algorithms/topic/graph", isCurrent: false },
                {
                    label: "Number of Islands",
                    href: "/data-structures-and-algorithms/topic/graph/exercise/number-of-islands",
                    isCurrent: true,
                },
            ]}
            beforeContent={<h1 className="leading-tight">Number of Islands</h1>}
        >
            <h2>Problem</h2>
            <p>
                Given an m x n binary grid where 1 is land and 0 is water, count the number of islands. An island is
                surrounded by water and is formed by connecting adjacent cells horizontally or vertically.
            </p>
            <h2>Approach</h2>
            <p>
                Scan the grid, and every time you meet an unvisited land cell start a flood fill that sinks the whole
                island. The number of times you had to start a fill is the answer, so the traversal cost is O(m · n).
            </p>
        </ReadingContentPageTemplate>
    </Still>
);
