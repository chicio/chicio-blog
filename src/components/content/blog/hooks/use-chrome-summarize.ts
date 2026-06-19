"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useDeviceCapabilities } from "@/components/design-system/hooks/use-device-capabilities";

export type SummaryType = "tldr" | "key-points";
export type SummaryStatus = "idle" | "downloading" | "loading" | "streaming" | "done" | "error";

export function useChromeSummarize() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [status, setStatus] = useState<SummaryStatus>("idle");
    const [result, setResult] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);
    const { deviceMemory } = useDeviceCapabilities();
    const abortRef = useRef<AbortController | null>(null);

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

    const reset = useCallback(() => {
        setStatus((current) => {
            if (current === "downloading") return current;
            abortRef.current?.abort();
            abortRef.current = null;
            return "idle";
        });
        setResult("");
    }, []);

    const summarize = useCallback(async (type: SummaryType, text: string) => {
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

                        // Some implementations expose only loaded as a 0..1 ratio.
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
                if (done) break;

                const chunk = typeof value === "string" ? value : decoder.decode(value, { stream: true });
                if (chunk.length > 0) {
                    fullText += chunk;
                    setResult(fullText);
                }
            }

            setStatus("done");
        } catch (error) {
            if ((error as Error).name === "AbortError") return;
            setStatus("error");
        }
    }, []);

    return { isAvailable, status, result, downloadProgress, summarize, reset };
}
