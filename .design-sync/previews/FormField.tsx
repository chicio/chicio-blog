import { FormField } from "chicio-blog";
import { BiEnvelope, BiSearch, BiUser } from "react-icons/bi";

export const Default = () => (
    <FormField label="Name" icon={<BiUser size={20} />} id="preview-name" type="text" placeholder="Your name" />
);

export const Filled = () => (
    <FormField
        label="Name"
        icon={<BiUser size={20} />}
        id="preview-name-filled"
        type="text"
        defaultValue="Fabrizio Duroni"
    />
);

export const WithError = () => (
    <FormField
        label="Email"
        icon={<BiEnvelope size={20} />}
        id="preview-email-error"
        type="email"
        defaultValue="fabrizio(at)example"
        hasError
    />
);

export const ContactFormFields = () => (
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
