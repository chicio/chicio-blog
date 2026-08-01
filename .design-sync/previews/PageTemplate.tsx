import type { ReactNode } from "react";
import { BrandHeader, InternalLink, PageTemplate, PageTitle, SectionHeading } from "chicio-blog";

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
    facebook: "https://www.facebook.com/fabrizio.duroni",
    instagram: "https://www.instagram.com/__chicio__/",
};

const archivedPosts = [
    { date: "18 July 2026", title: "Memories and failures: 18 years as a software engineer", href: "/blog" },
    { date: "01 June 2026", title: "App.js Conf 2026: React Native, from the source", href: "/blog" },
    { date: "01 May 2026", title: "Build your own MCP server to expose your blog to AI agents", href: "/blog" },
];

export const BlogArchive = () => (
    <Still>
        <PageTemplate
            header={<BrandHeader big={false} />}
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
        >
            <PageTitle>Archive</PageTitle>
            {archivedPosts.map((post) => (
                <div
                    className="container-fluid mb-4 flex flex-col items-start px-0 md:flex-row md:items-center"
                    key={post.title}
                >
                    <div className="flex-1/6">
                        <time className="text-xl">{post.date}</time>
                    </div>
                    <div className="flex-5/6">
                        <InternalLink className="text-xl" to={post.href}>
                            {post.title}
                        </InternalLink>
                    </div>
                </div>
            ))}
        </PageTemplate>
    </Still>
);

// Menu is `fixed` and floats over the top of the page, so anything handed to the header slot has to
// reserve room for it the way BrandHeader does with its fixed-height matrix band. Without the top
// offset the title's first line renders underneath the nav bar. The offset is a plain <style> rule
// rather than a Tailwind utility because the bundle ships prebuilt CSS: a spacing utility the design
// system does not already use itself would not be compiled, and would silently do nothing.
const HeaderSlotOffset = ({ children }: { children: ReactNode }) => (
    <>
        <style>{`.ds-header-slot { padding-top: 5rem; }`}</style>
        <div className="ds-header-slot">{children}</div>
    </>
);

export const CustomHeaderSlot = () => (
    <Still>
        <PageTemplate
            header={
                <HeaderSlotOffset>
                    <PageTitle>Data structures and algorithms</PageTitle>
                </HeaderSlotOffset>
            }
            author="Fabrizio Duroni"
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
        >
            <SectionHeading
                title="Roadmap"
                description="Every topic of the course, in the order I recommend studying them."
            />
            <p>
                A complete course on data structures and algorithms, from arrays and hash maps up to graphs and
                dynamic programming, with an exercise list for every topic.
            </p>
        </PageTemplate>
    </Still>
);
