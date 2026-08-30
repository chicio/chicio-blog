import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Breadcrumbs/Breadcrumb",
    component: Breadcrumb,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <Breadcrumb
        items={[
            { label: "DSA", href: "/data-structures-and-algorithms/roadmap", isCurrent: false },
            { label: "Graph", href: "/data-structures-and-algorithms/topic/graph", isCurrent: true },
        ]}
    />
);

const DeepTrailStory = () => (
    <Breadcrumb
        items={[
            { label: "DSA", href: "/data-structures-and-algorithms/roadmap", isCurrent: false },
            { label: "Graph", href: "/data-structures-and-algorithms/topic/graph", isCurrent: false },
            {
                label: "Number of Islands",
                href: "/data-structures-and-algorithms/topic/graph/exercise/number-of-islands",
                isCurrent: true,
            },
        ]}
    />
);

const SingleLevelStory = () => <Breadcrumb items={[{ label: "Blog", href: "/blog", isCurrent: true }]} />;

export const Default: Story = { render: () => <DefaultStory /> };
export const DeepTrail: Story = { render: () => <DeepTrailStory /> };
export const SingleLevel: Story = { render: () => <SingleLevelStory /> };
