"use client";

import { FC, useState, useEffect } from "react";
import {
  BiEnvelope,
  BiUser,
  BiMessageDetail,
} from "react-icons/bi";
import { tracking } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";
import { contactQueue } from "@/lib/background-sync/contact-queue";
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
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot field
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [submitError, setSubmitError] = useState<{ submit?: string }>({});

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
    setIsSuccess(false);
    setIsQueued(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError({});

    // Offline path: queue and show feedback immediately
    if (!navigator.onLine) {
      contactQueue.enqueue({ name, email, message, honeypot });

      trackWith({
        action: tracking.action.contact_queued_offline,
        category: trackingCategory,
        label: tracking.label.body,
      });

      setIsQueued(true);
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, honeypot }),
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
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (error) {
      // Network failure mid-request: queue for retry
      if (!navigator.onLine) {
        contactQueue.enqueue({ name, email, message, honeypot });

        trackWith({
          action: tracking.action.contact_queued_offline,
          category: trackingCategory,
          label: tracking.label.body,
        });

        setIsQueued(true);
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
      } else {
        console.error("Contact form error:", error);
        setSubmitError({ submit: (error as Error).message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setErrors({});
    setSubmitError({});
    setIsSuccess(false);
    setIsQueued(false);

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
        {/* Honeypot field - hidden from users, visible to bots */}
        <div className="absolute -left-2499.75 -top-2499.75 opacity-0">
          <FormField
            label="Additional Information"
            icon={<BiMessageDetail size={20} />}
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
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
