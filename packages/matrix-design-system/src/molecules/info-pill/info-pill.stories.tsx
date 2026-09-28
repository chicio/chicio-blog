import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCalendarOutline, IoLanguageOutline, IoLibraryOutline } from "react-icons/io5";
import { InfoPill } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Info Pill",
    component: InfoPill,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => <InfoPill icon={<IoCalendarOutline />} label="Acquired" value="2026" />;

// How a detail page uses it: a wrapping row of pills, each one a single fact about the item.
const PillGridStory = () => (
    <div className="flex flex-wrap gap-4">
        <InfoPill icon={<IoLibraryOutline />} label="Publisher" value="Star Comics" />
        <InfoPill icon={<IoLanguageOutline />} label="Language" value="Italian" />
        <InfoPill icon={<IoCalendarOutline />} label="Acquired" value="2026" />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const PillGrid: Story = { render: () => <PillGridStory /> };
