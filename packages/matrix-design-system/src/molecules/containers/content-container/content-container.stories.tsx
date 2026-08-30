import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "../../../atoms/chip";
import { ContentContainer } from ".";
import { StatCard } from "../../stat-card";
import { PageTitle } from "../../typography/page-title";
import { SectionHeading } from "../../typography/section-heading";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Containers/Content Container",
    component: ContentContainer,
};

export default meta;

type Story = StoryObj;

// ContentContainer is the page column itself (container-fixed + vertical rhythm), so it is never
// rendered empty here: each cell fills it with the kind of content the real routes put inside it.
const ArticleColumnStory = () => (
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

const StatsSectionStory = () => (
    <ContentContainer>
        <SectionHeading title="Blog in numbers" description="Everything published on fabrizioduroni.it so far." />
        <div className="mt-4 flex flex-wrap gap-4">
            <StatCard value={96} label="Articles" />
            <StatCard value={287} label="DSA lessons" />
        </div>
    </ContentContainer>
);

const ChatIntroStory = () => (
    <ContentContainer>
        <PageTitle>Ask the Oracle</PageTitle>
        <p className="text-primary-text">Ask anything about my work, projects and code.</p>
    </ContentContainer>
);

export const ArticleColumn: Story = { render: () => <ArticleColumnStory /> };
export const StatsSection: Story = { render: () => <StatsSectionStory /> };
export const ChatIntro: Story = { render: () => <ChatIntroStory /> };
