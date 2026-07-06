"use client";

import { FC } from "react";
import {
    BiEnvelope,
    BiUser,
    BiMessageDetail,
} from "react-icons/bi";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { FormField } from "@/components/design-system/molecules/form/form-field";
import { FormTextarea } from "@/components/design-system/molecules/form/form-textarea";
import { FormErrorSummary } from "@/components/design-system/molecules/form/form-error-summary";
import { FormSuccessMessage } from "@/components/design-system/molecules/form/form-success-message";
import {
    RedPillButton,
    BluePillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import { LoadingBar } from "@/components/design-system/organism/loading-bar";
import { useContactFormStore } from "./use-contact-form-store";

export interface ContactFormProps {
    trackingCategory: string;
}

export const ContactForm: FC<ContactFormProps> = ({ trackingCategory }) => {
    const { state, effects } = useContactFormStore(trackingCategory);
    const {
        name,
        email,
        message,
        honeypot,
        errors,
        isSubmitting,
        isSuccess,
        isQueued,
        isOffline,
        submitError,
    } = state;
    const { onNameChange, onEmailChange, onMessageChange, onHoneypotChange, handleSubmit, handleReset } = effects;
    const onReset = handleReset(trackingCategory);

    return (
        <div className="mx-auto max-w-2xl">
            <PageTitle>Contact Me</PageTitle>
            <div className="mb-8 text-center">
                <p className="text-matrix-green/70">
                    Fill out the form to send me a message. I&apos;ll get back to you as soon as possible.
                </p>
                {isOffline && (
                    <p className="mt-2 text-sm font-mono text-yellow-400/80">
                        {">"} You are offline. Your message will be sent automatically when you reconnect.
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-8">
                <FormField
                    label="Name"
                    icon={<BiUser size={20} />}
                    type="text"
                    id="name"
                    value={name}
                    onChange={onNameChange}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    hasError={!!errors.name}
                />
                <FormField
                    label="Email"
                    icon={<BiEnvelope size={20} />}
                    type="email"
                    id="email"
                    value={email}
                    onChange={onEmailChange}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    hasError={!!errors.email}
                />
                <FormTextarea
                    label="Message"
                    icon={<BiMessageDetail size={20} />}
                    id="message"
                    value={message}
                    onChange={onMessageChange}
                    rows={8}
                    placeholder="Your message..."
                    disabled={isSubmitting}
                    hasError={!!errors.message}
                />
                <div aria-hidden="true" className="absolute -left-2499.75 -top-2499.75 opacity-0">
                    <FormField
                        label="Additional Information"
                        icon={<BiMessageDetail size={20} />}
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={onHoneypotChange}
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>
                <FormErrorSummary show={Object.keys(errors).length > 0} errorName="Form incomplete" errorsList={errors} />
                <FormErrorSummary show={!!submitError?.submit} errorName={submitError?.submit} />
                {isSuccess && (
                    <FormSuccessMessage message="Message sent! You should receive a confirmation email in your inbox shortly. I'll get back to you as soon as possible." />
                )}
                {isQueued && (
                    <FormSuccessMessage message="You're offline — your message has been saved and will be sent automatically when you reconnect to the internet." />
                )}
                {isSubmitting && (
                    <LoadingBar message="Sending message" />
                )}
                <div className="mt-8 flex flex-row justify-center gap-4">
                    <BluePillButton onClick={onReset} disabled={isSubmitting}>
                        Reset
                    </BluePillButton>
                    <RedPillButton onClick={handleSubmit} disabled={isSubmitting}>
                        Send Message
                    </RedPillButton>
                </div>
            </div>
        </div>
    );
};
