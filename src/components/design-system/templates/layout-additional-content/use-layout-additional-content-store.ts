"use client";

import { useEffect } from "react";
import { contactQueue } from "@/lib/background-sync/contact-queue";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { ComponentStore } from "@/types/component-store";

type LayoutAdditionalContentState = Record<string, never>;
type LayoutAdditionalContentEffects = Record<string, never>;

export const useLayoutAdditionalContentStore = (): ComponentStore<
    LayoutAdditionalContentState,
    LayoutAdditionalContentEffects
> => {
    useEffect(() => {
        const replayQueue = async () => {
            while (!contactQueue.isEmpty()) {
                const entry = contactQueue.dequeue();
                if (!entry) {
                    break;
                }
                try {
                    await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: entry.name,
                            email: entry.email,
                            message: entry.message,
                            honeypot: entry.honeypot,
                        }),
                    });
                    trackWith({
                        action: tracking.action.contact_queue_replayed,
                        category: tracking.category.pwa,
                        label: tracking.label.body,
                    });
                } catch {
                    // Single attempt — entry already dequeued, discard on failure
                }
            }
        };

        window.addEventListener("online", replayQueue);
        if (navigator.onLine) {
            replayQueue();
        }
        return () => {
            window.removeEventListener("online", replayQueue);
        };
    }, []);

    return {
        state: {},
        effects: {},
    };
};
