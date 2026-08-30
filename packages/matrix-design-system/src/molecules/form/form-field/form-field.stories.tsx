import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from ".";
import { BiEnvelope, BiSearch, BiUser } from "react-icons/bi";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Form/Form Field",
    component: FormField,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <FormField label="Name" icon={<BiUser size={20} />} id="preview-name" type="text" placeholder="Your name" />
);

const FilledStory = () => (
    <FormField
        label="Name"
        icon={<BiUser size={20} />}
        id="preview-name-filled"
        type="text"
        defaultValue="Fabrizio Duroni"
    />
);

const WithErrorStory = () => (
    <FormField
        label="Email"
        icon={<BiEnvelope size={20} />}
        id="preview-email-error"
        type="email"
        defaultValue="fabrizio(at)example"
        hasError
    />
);

const ContactFormFieldsStory = () => (
    <div className="flex flex-col gap-8">
        <FormField label="Name" icon={<BiUser size={20} />} id="contact-name" type="text" placeholder="Your name" />
        <FormField
            label="Email"
            icon={<BiEnvelope size={20} />}
            id="contact-email"
            type="email"
            placeholder="your@email.com"
        />
        <FormField
            label="Search the blog"
            icon={<BiSearch size={20} />}
            id="contact-search"
            type="search"
            placeholder="SwiftUI, Kotlin, Next.js..."
            disabled
        />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const Filled: Story = { render: () => <FilledStory /> };
export const WithError: Story = { render: () => <WithErrorStory /> };
export const ContactFormFields: Story = { render: () => <ContactFormFieldsStory /> };
