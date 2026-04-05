"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDeviceCapabilities } from "@/components/design-system/utils/hooks/use-device-capabilities";

export type SummaryType = "tldr" | "key-points";
type SummaryStatus = "idle" | "downloading" | "loading" | "streaming" | "done" | "error";

interface UseChromeSummarizeReturn {
    isAvailable: boolean;
    status: SummaryStatus;
    result: string;
    downloadProgress: number;
    summarize: (type: SummaryType, text: string) => Promise<void>;
    reset: () => void;
}

export function useChromeSummarize(): UseChromeSummarizeReturn {
    const [isAvailable, setIsAvailable] = useState(false);
    const [status, setStatus] = useState<SummaryStatus>("idle");
    const [result, setResult] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);
    const { deviceMemory } = useDeviceCapabilities();
    const abortControllerRef = useRef<AbortController | null>(null);
    const summarizersRef = useRef<Map<SummaryType, AISummarizer>>(new Map());

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

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
    }, []);

    const reset = useCallback(() => {
        setStatus((current) => {
            if (current === "downloading") {
                return current;
            } 
            abort();

            return "idle";
        });
        setResult("");
    }, [abort]);

    const summarize = useCallback(async (type: SummaryType, text: string) => {
        abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            let summarizer = summarizersRef.current.get(type);
            if (!summarizer) {
                setStatus("downloading");
                setDownloadProgress(0);

                summarizer = await self.Summarizer.create({
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
                summarizersRef.current.set(type, summarizer);
            }

            setStatus("loading");
            setResult("");

            const stream = summarizer.summarizeStreaming(text);

            setStatus("streaming");
            let fullText = "";

            for await (const chunk of stream) {
                if (controller.signal.aborted) return;
                const text = typeof chunk === "string" ? chunk : String(chunk);
                if (text.length > 0) {
                    fullText += text;
                    setResult(fullText);
                }
            }

            setStatus("done");
        } catch (error) {
            if ((error as Error).name === "AbortError") return;
            setStatus("error");
        }
    }, [abort]);

    useEffect(() => {
        return () => {
            abort();
            summarizersRef.current.forEach((s) => s.destroy?.());
            summarizersRef.current.clear();
        };
    }, [abort]);

    return { isAvailable, status, result, downloadProgress, summarize, reset };
}
