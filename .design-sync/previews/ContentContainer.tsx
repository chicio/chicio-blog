import { Chip, ContentContainer, PageTitle, SectionHeading, StatCard } from "chicio-blog";

// ContentContainer is the page column itself (container-fixed + vertical rhythm), so it is never
// rendered empty here: each cell fills it with the kind of content the real routes put inside it.
export const ArticleColumn = () => (
    <ContentContainer>
        <PageTitle>Data structures and algorithms</PageTitle>
        <p className="text-primary-text">
            A complete course on data structures and algorithms, from arrays and hash maps up to graphs and dynamic
            programming, with a visualizer and a code template for every topic.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
            <Chip>Graph</Chip>
            <Chip>Binary search</Chip>
            <Chip>Dynamic programming</Chip>
            <Chip>Backtracking</Chip>
        </div>
    </ContentContainer>
);

export const StatsSection = () => (
    <ContentContainer>
        <SectionHeading title="Blog in numbers" description="Everything published on fabrizioduroni.it so far." />
        <div className="mt-4 flex flex-wrap gap-4">
            <StatCard value={96} label="Articles" />
            <StatCard value={287} label="DSA lessons" />
        </div>
    </ContentContainer>
);

export const ChatIntro = () => (
    <ContentContainer>
        <PageTitle>Ask the Oracle</PageTitle>
        <p className="text-primary-text">Ask anything about my work, projects and code.</p>
    </ContentContainer>
);
