import { InputField } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <InputField
            id="name"
            type="text"
            aria-label="Name"
            placeholder="Your name"
            className="w-80 px-4 py-3"
        />
    </div>
);

export const NumericOperand = () => (
    <div className="flex items-center gap-2">
        <span className="text-primary-text font-mono">A:</span>
        <InputField type="number" aria-label="Operand A" defaultValue={12} className="w-20 rounded border px-2 py-1" />
        <span className="text-primary-text font-mono">B:</span>
        <InputField type="number" aria-label="Operand B" defaultValue={10} className="w-20 rounded border px-2 py-1" />
    </div>
);

export const ChatPrompt = () => (
    <div className="flex max-w-150">
        <InputField
            aria-label="Ask me anything"
            defaultValue="Which articles have you written about SwiftUI?"
            className="w-full pt-3 pr-9 pb-3 pl-4 backdrop-blur-2xl"
        />
    </div>
);

export const ContactFormStack = () => (
    <div className="flex w-80 flex-col gap-4">
        <InputField id="contact-name" type="text" aria-label="Name" placeholder="Your name" className="px-4 py-3" />
        <InputField
            id="contact-email"
            type="email"
            aria-label="Email"
            placeholder="your@email.com"
            className="px-4 py-3"
        />
    </div>
);
