import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from ".";
import { BiEnvelope, BiMessageDetail, BiUser } from "react-icons/bi";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Typography/Label",
    component: Label,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <Label id="name" value="Name" icon={<BiUser size={20} />} />
    </div>
);

const WithoutIconStory = () => (
    <div className="flex">
        <Label id="reading-time" value="Reading time" />
    </div>
);

const ContactFormLabelsStory = () => (
    <div className="flex flex-col gap-6">
        <Label id="name" value="Name" icon={<BiUser size={20} />} />
        <Label id="email" value="Email" icon={<BiEnvelope size={20} />} />
        <Label id="message" value="Message" icon={<BiMessageDetail size={20} />} />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const WithoutIcon: Story = { render: () => <WithoutIconStory /> };
export const ContactFormLabels: Story = { render: () => <ContactFormLabelsStory /> };
