interface AISummarizerOptions {
    type?: "tldr" | "key-points" | "teaser" | "headline";
    format?: "markdown" | "plain-text";
    length?: "short" | "medium" | "long";
    monitor?: (monitor: AICreateMonitor) => void;
}

interface AISummarizer {
    summarize(text: string, options?: { signal?: AbortSignal }): Promise<string>;
    summarizeStreaming(text: string, options?: { signal?: AbortSignal }): AsyncIterable<string>;
    destroy?(): void;
}

interface AICreateMonitor extends EventTarget {
    addEventListener(type: "downloadprogress", listener: (event: DownloadProgressEvent) => void): void;
}

interface DownloadProgressEvent extends Event {
    loaded: number;
}

interface SummarizerStatic {
    availability(): Promise<"unavailable" | "downloadable" | "downloading" | "available">;
    create(options?: AISummarizerOptions): Promise<AISummarizer>;
}

declare const Summarizer: SummarizerStatic;
