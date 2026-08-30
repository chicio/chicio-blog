import type { Meta, StoryObj } from "@storybook/react-vite";
import { ParagraphTitleWithIcon } from ".";
import { BiPlug, BiTerminal, BiWrench } from "react-icons/bi";
import { FaGamepad, FaLightbulb } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Typography/Paragraph Title With Icon",
    component: ParagraphTitleWithIcon,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <h2>
        <ParagraphTitleWithIcon icon={<FaGamepad className="text-shadow-lg" />}>Gameplay</ParagraphTitleWithIcon>
    </h2>
);

const SubSectionTitleStory = () => (
    <h3>
        <ParagraphTitleWithIcon icon={<BiTerminal className="text-accent text-xl" />}>
            Claude Code
        </ParagraphTitleWithIcon>
    </h3>
);

const VideogamesSectionTitlesStory = () => (
    <div className="flex flex-col">
        <h2>
            <ParagraphTitleWithIcon icon={<FiCpu className="text-shadow-lg" />}>Hardware specs</ParagraphTitleWithIcon>
        </h2>
        <h2>
            <ParagraphTitleWithIcon icon={<FaLightbulb className="text-shadow-lg" />}>
                Trivia & Fun Facts
            </ParagraphTitleWithIcon>
        </h2>
    </div>
);

const McpSectionTitlesStory = () => (
    <div className="flex flex-col">
        <h2>
            <ParagraphTitleWithIcon icon={<BiWrench className="text-accent" />}>Available Tools</ParagraphTitleWithIcon>
        </h2>
        <h2>
            <ParagraphTitleWithIcon icon={<BiPlug className="text-accent text-2xl" />}>
                Connect Your AI Assistant
            </ParagraphTitleWithIcon>
        </h2>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const SubSectionTitle: Story = { render: () => <SubSectionTitleStory /> };
export const VideogamesSectionTitles: Story = { render: () => <VideogamesSectionTitlesStory /> };
export const McpSectionTitles: Story = { render: () => <McpSectionTitlesStory /> };
