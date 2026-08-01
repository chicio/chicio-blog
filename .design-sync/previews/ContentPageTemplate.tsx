import type { ReactNode } from "react";
import { Chip, ContentPageTemplate, PageTitle, StatCard, TerminalButton } from "chicio-blog";

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

const tags = ["swift", "swiftui", "react-native", "kotlin", "typescript", "metal", "algorithms", "ai"];

export const TagsPage = () => (
    <Still>
        <ContentPageTemplate
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
        >
            <PageTitle>Tags</PageTitle>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                ))}
            </div>
        </ContentPageTemplate>
    </Still>
);

export const BigHeader = () => (
    <Still>
        <ContentPageTemplate
            big
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
        >
            <div className="glow-container bg-general-background-light relative mt-5 flex w-full flex-col">
                <div className="flex flex-1 flex-col p-5">
                    <h3 className="mt-0!">Build your own MCP server to expose your blog to AI agents</h3>
                    <div className="flex flex-row gap-3">
                        <time>01 May 2026</time>
                        <span className="text-secondary-text">9 min read</span>
                    </div>
                    <p className="mx-0 text-shadow-md">
                        How I exposed every post, tag and DSA exercise of this blog as Model Context Protocol tools, so an
                        AI assistant can read the site without scraping a single line of HTML. [...]
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Chip>mcp</Chip>
                        <Chip>ai</Chip>
                        <Chip>typescript</Chip>
                    </div>
                </div>
                <TerminalButton className="mx-5 mt-auto mb-4" to="/blog" label="Read more" />
            </div>
        </ContentPageTemplate>
    </Still>
);

export const StatsPage = () => (
    <Still>
        <ContentPageTemplate
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
        >
            <PageTitle>Blog stats</PageTitle>
            <div className="grid grid-cols-3 gap-4">
                <StatCard value={96} label="Articles" />
                <StatCard value={287} label="DSA lessons" />
                <StatCard value={42} label="Tags" />
            </div>
        </ContentPageTemplate>
    </Still>
);
