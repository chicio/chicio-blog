import { FormSuccessMessage } from "chicio-blog";

export const Default = () => (
    <FormSuccessMessage message="Message sent! You should receive a confirmation email in your inbox shortly. I'll get back to you as soon as possible." />
);

export const OfflineQueued = () => (
    <FormSuccessMessage message="You're offline — your message has been saved and will be sent automatically when you reconnect to the internet." />
);

export const ShortMessage = () => <FormSuccessMessage message="Message sent!" />;
