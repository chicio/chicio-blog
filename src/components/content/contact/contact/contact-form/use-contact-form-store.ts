"use client";

import { useState, useEffect, useCallback } from "react";
import { tracking } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";
import { contactQueue } from "@/lib/background-sync/contact-queue";
import { ComponentStore } from "@/types/component-store";

interface ContactFormErrors {
    name?: string;
    email?: string;
    message?: string;
}

interface ContactFormState {
    name: string;
    email: string;
    message: string;
    honeypot: string;
    errors: ContactFormErrors;
    isSubmitting: boolean;
    isSuccess: boolean;
    isQueued: boolean;
    isOffline: boolean;
    submitError: { submit?: string };
}

interface ContactFormEffects {
    setName: (value: string) => void;
    setEmail: (value: string) => void;
    setMessage: (value: string) => void;
    setHoneypot: (value: string) => void;
    handleSubmit: () => Promise<void>;
    handleReset: (trackingCategory: string) => () => void;
}

export const useContactFormStore = (trackingCategory: string): ComponentStore<ContactFormState, ContactFormEffects> => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [errors, setErrors] = useState<ContactFormErrors>({});
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
        const newErrors: ContactFormErrors = {};

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

    const handleSubmit = useCallback(async () => {
        setIsSuccess(false);
        setIsQueued(false);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError({});

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
    }, [name, email, message, honeypot, trackingCategory]);

    const handleReset = useCallback(
        (category: string) => () => {
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
                category,
                label: tracking.label.body,
            });
        },
        [],
    );

    return {
        state: {
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
        },
        effects: {
            setName,
            setEmail,
            setMessage,
            setHoneypot,
            handleSubmit,
            handleReset,
        },
    };
};
