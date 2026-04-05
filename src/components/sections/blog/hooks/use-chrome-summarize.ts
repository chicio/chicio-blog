"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useDeviceCapabilities } from "@/components/design-system/utils/hooks/use-device-capabilities";

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
                monitor(m: AICreateMonitor) {
                    m.addEventListener("downloadprogress", ((e: DownloadProgressEvent) => {
                        setDownloadProgress(Math.round(e.loaded * 100));
                    }) as EventListener);
                },
            });

            setStatus("streaming");
            setResult("");

            const stream = summarizer.summarizeStreaming(text);
            let fullText = "";

            for await (const chunk of stream) {
                if (abortRef.current?.signal.aborted) {
                    return;
                }
                
                if ((chunk as string).length > 0) {
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
