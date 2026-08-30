import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Buttons/Tag",
    component: Tag,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <Tag tag="typescript" link="/blog/tag/typescript/" big={false} onClick={() => {}} />
    </div>
);

const BigStory = () => (
    <div className="flex">
        <Tag tag="web development" link="/blog/tag/web-development/" big={true} onClick={() => {}} />
    </div>
);

const PostTagRowStory = () => (
    <div className="flex flex-wrap">
        <Tag tag="ai" link="/blog/tag/ai/" big={false} />
        <Tag tag="mcp" link="/blog/tag/mcp/" big={false} />
        <Tag tag="typescript" link="/blog/tag/typescript/" big={false} />
        <Tag tag="web development" link="/blog/tag/web-development/" big={false} />
        <Tag tag="nextjs" link="/blog/tag/nextjs/" big={false} />
    </div>
);

const BigTagCloudStory = () => (
    <div className="flex flex-wrap">
        <Tag tag="swift" link="/blog/tag/swift/" big={true} />
        <Tag tag="kotlin" link="/blog/tag/kotlin/" big={true} />
        <Tag tag="react native" link="/blog/tag/react-native/" big={true} />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const Big: Story = { render: () => <BigStory /> };
export const PostTagRow: Story = { render: () => <PostTagRowStory /> };
export const BigTagCloud: Story = { render: () => <BigTagCloudStory /> };
