"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDeviceCapabilities } from "@/components/design-system/hooks/use-device-capabilities";
import { ComponentStore } from "@/types/component-store";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

export type SummaryType = "tldr" | "key-points";
type SummaryStatus = "idle" | "downloading" | "loading" | "streaming" | "done" | "error";
type ModalStatus = "downloading" | "loading" | "streaming" | "done" | "error";

interface ChromeAiFeaturesToolbarState {
    isAvailable: boolean;
    modalOpen: boolean;
    modalTitle: string;
    summaryResult: string;
    summaryStatus: ModalStatus;
    downloadProgress: number;
}

interface ChromeAiFeaturesToolbarEffects {
    handleSummarize: (type: SummaryType) => () => void;
    handleClose: () => void;
    handleRetry: () => void;
    handleToggleAccordion: () => void;
}

export const useChromeAiFeaturesToolbarStore = (
    contentContainerId: string,
): ComponentStore<ChromeAiFeaturesToolbarState, ChromeAiFeaturesToolbarEffects> => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [status, setStatus] = useState<SummaryStatus>("idle");
    const [result, setResult] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [activeSummaryType, setActiveSummaryType] = useState<SummaryType>("tldr");
    const abortRef = useRef<AbortController | null>(null);
    const { deviceMemory } = useDeviceCapabilities();

    useEffect(() => {
        const checkAvailability = async () => {
            if (!("Summarizer" in self) || (deviceMemory !== undefined && deviceMemory < 8)) {
                return;
            }

            try {
                const availability = await self.Summarizer.availability();
                setIsAvailable(availability !== "unavailable");
            } catch {
                setIsAvailable(false);
            }
        };

        checkAvailability();
    }, [deviceMemory]);

    const runSummarize = useCallback(async (type: SummaryType, text: string) => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        try {
            setStatus("downloading");
            setDownloadProgress(0);

            const summarizer = await self.Summarizer.create({
                type,
                format: "markdown",
                length: "long",
                outputLanguage: "en",
                monitor(monitor: CreateMonitor) {
                    monitor.addEventListener("downloadprogress", (event: ProgressEvent) => {
                        if (typeof event.loaded === "number" && typeof event.total === "number" && event.total > 0) {
                            setDownloadProgress(Math.round((event.loaded / event.total) * 100));
                            return;
                        }

                        const loaded = (event as ProgressEvent & { loaded?: number }).loaded;
                        setDownloadProgress(Math.round((loaded ?? 0) * 100));
                    });
                },
            });

            setStatus("streaming");
            setResult("");

            const stream = summarizer.summarizeStreaming(text);
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            while (true) {
                if (abortRef.current?.signal.aborted) {
                    await reader.cancel();
                    return;
                }

                const { done, value } = await reader.read();
                if (done) { break; }

                const chunk = typeof value === "string" ? value : decoder.decode(value, { stream: true });
                if (chunk.length > 0) {
                    fullText += chunk;
                    setResult(fullText);
                }
            }

            setStatus("done");
        } catch (error) {
            if ((error as Error).name === "AbortError") { return; }
            setStatus("error");
        }
    }, []);

    const handleSummarize = (type: SummaryType) => () => {
        const container = document.getElementById(contentContainerId);

        if (!container) {
            return;
        }

        const text = container.innerText;
        const title = type === "tldr" ? "TL;DR" : "Key Points";

        trackWith({
            action: type === "tldr" ? tracking.action.chrome_ai_tldr : tracking.action.chrome_ai_key_points,
            category: tracking.category.blog_post,
            label: tracking.label.body,
        });

        setModalTitle(title);
        setActiveSummaryType(type);
        setModalOpen(true);
        runSummarize(type, text);
    };

    const handleClose = () => {
        setStatus((current) => {
            if (current === "downloading") { return current; }
            abortRef.current?.abort();
            abortRef.current = null;
            return "idle";
        });
        setResult("");
        setModalOpen(false);
    };

    const handleRetry = () => {
        const container = document.getElementById(contentContainerId);
        if (!container) {
            return;
        }
        runSummarize(activeSummaryType, container.innerText);
    };

    const handleToggleAccordion = () => {
        trackWith({
            action: tracking.action.toggle_chrome_ai_features,
            category: tracking.category.blog_post,
            label: tracking.label.body,
        });
    };

    const summaryStatus: ModalStatus = status === "idle" ? "loading" : status;

    return {
        state: { isAvailable, modalOpen, modalTitle, summaryResult: result, summaryStatus, downloadProgress },
        effects: { handleSummarize, handleClose, handleRetry, handleToggleAccordion },
    };
};
