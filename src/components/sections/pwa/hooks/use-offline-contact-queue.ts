"use client";

import { useEffect } from "react";
import { contactQueue } from "@/lib/background-sync/contact-queue";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

/**
 * Mounts a global listener that replays any queued contact-form submissions
 * when the browser comes back online. Should be mounted once at the root layout level.
 */
export function useOfflineContactQueue() {
    useEffect(() => {
        const replayQueue = async () => {
            const queued = contactQueue.getAll();

            if (queued.length === 0) {
                return;
            }

            for (const entry of queued) {
                try {
                    const response = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: entry.name,
                            email: entry.email,
                            message: entry.message,
                            honeypot: entry.honeypot,
                        }),
                    });

                    if (response.ok) {
                        contactQueue.remove(entry.id);
                        trackWith({
                            action: tracking.action.contact_queue_replayed,
                            category: tracking.category.pwa,
                            label: tracking.label.body,
                        });
                    }
                } catch {
                    // Still offline or server error — leave in queue, will retry next online event
                }
            }
        };

        window.addEventListener("online", replayQueue);

        // Also replay on mount in case we came back online while the tab was closed
        if (navigator.onLine) {
            replayQueue();
        }

        return () => {
            window.removeEventListener("online", replayQueue);
        };
    }, []);
}
