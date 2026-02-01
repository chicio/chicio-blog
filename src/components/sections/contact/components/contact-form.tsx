"use client";

import { FC, useState, FormEvent } from "react";
import {
  BiEnvelope,
  BiUser,
  BiMessageDetail,
  BiErrorCircle,
} from "react-icons/bi";
import { tracking } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";
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

export interface ContactFormProps {
  trackingCategory: string;
}

export const ContactForm: FC<ContactFormProps> = ({ trackingCategory }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      trackWith({
        action: tracking.action.send_mail,
        category: trackingCategory,
        label: tracking.label.body,
      });

      trackWith({
        action: tracking.action.red_pill,
        category: trackingCategory,
        label: tracking.label.body,
      });

      setIsSuccess(true);
      // setName("");
      // setEmail("");
      // setMessage("");
      setErrors({});
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSubmitError(null);
    setIsSuccess(false);

    trackWith({
      action: tracking.action.blue_pill,
      category: trackingCategory,
      label: tracking.label.body,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle>Contact Me</PageTitle>
      <div className="mb-8 text-center">
        <p className="text-matrix-green/70">
          Fill out the form to send me a message. I'll get back to you as soon
          as possible.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <FormField
          label="Name"
          icon={<BiUser size={20} />}
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={isSubmitting}
          hasError={!!errors.email}
        />
        <FormTextarea
          label="Message"
          icon={<BiMessageDetail size={20} />}
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          placeholder="Your message..."
          disabled={isSubmitting}
          hasError={!!errors.message}
        />
        <FormErrorSummary errors={errors} />
        {isSuccess && (
          <FormSuccessMessage message="Message sent successfully! I'll get back to you soon." />
        )}
        {isSubmitting && (
          <LoadingBar message="Sending message" />
        )}
        <div className="mt-8 flex flex-row justify-center gap-4">
          <BluePillButton onClick={handleReset} disabled={isSubmitting}>
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
