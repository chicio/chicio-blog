# Chrome AI Summarizer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add TL;DR and Key Points summarization to blog posts using Chrome's Summarizer API with progressive enhancement.

**Architecture:** Design system components (Accordion, Loader, TerminalProgressBar) are created first as reusable building blocks. Then the `useDeviceCapabilities` hook is extracted from `useReducedMotions`. The `useChromeSummarize` hook encapsulates all Summarizer API logic (feature detection, download monitoring, streaming, caching, cancellation). Feature-specific components (toolbar, modal) wire everything together and integrate into `blog-post-content.tsx`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Framer Motion v12, TailwindCSS v4, Chrome Summarizer API

**Spec:** `docs/superpowers/specs/2026-04-05-chrome-ai-summarizer-design.md`

---

## Chunk 1: Design System Components & Refactors

### Task 1: Add tracking actions

**Files:**
- Modify: `src/types/configuration/tracking.ts:50`

- [ ] **Step 1: Add new tracking actions**

In `src/types/configuration/tracking.ts`, add 4 new actions at the end of the `action` object (before line 50's closing `},`):

```typescript
    open_videogame_collection: "open_videogame_collection",
    toggle_chrome_ai_features: "toggle_chrome_ai_features",
    chrome_ai_tldr: "chrome_ai_tldr",
    chrome_ai_key_points: "chrome_ai_key_points",
    open_chrome_ai_docs: "open_chrome_ai_docs",},
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/types/configuration/tracking.ts && git commit -m "feat: add Chrome AI tracking actions"
```

---

### Task 2: Create Loader atom

**Files:**
- Create: `src/components/design-system/atoms/loader/loader.tsx`

- [ ] **Step 1: Create the Loader component**

Create `src/components/design-system/atoms/loader/loader.tsx`:

```tsx
import { FC } from "react";

const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
};

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Loader: FC<LoaderProps> = ({ size = "md", className }) => (
    <div
        role="status"
        aria-label="Loading summary"
        className={`${sizeClasses[size]} animate-spin rounded-full border-accent border-t-transparent${className ? ` ${className}` : ""}`}
    />
);
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/components/design-system/atoms/loader/loader.tsx && git commit -m "feat: add Loader atom to design system"
```

---

### Task 3: Extract TerminalProgressBar

**Files:**
- Create: `src/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar.tsx`
- Modify: `src/components/design-system/organism/reading-content-progress-bar.tsx:18-44`

- [ ] **Step 1: Create the TerminalProgressBar component**

Create `src/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar.tsx`:

```tsx
import { FC } from "react";
import {
    Cursor,
    SuccessText,
    TerminalLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";

const getBar = (percentage: number, length = 24) => {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]  ${percentage}%`;
};

interface TerminalProgressBarProps {
    percentage: number;
    loadingMessage: string;
    completeMessage: string;
    shouldReduceMotion?: boolean;
}

export const TerminalProgressBar: FC<TerminalProgressBarProps> = ({
    percentage,
    loadingMessage,
    completeMessage,
    shouldReduceMotion = false,
}) => {
    const isComplete = percentage >= 100;

    return (
        <div className="flex flex-col items-center justify-center">
            <TerminalLine>
                {isComplete ? (
                    <SuccessText>{`> ${completeMessage}`}</SuccessText>
                ) : (
                    <>
                        {`> ${loadingMessage}`} {!shouldReduceMotion ? <Cursor /> : null}
                    </>
                )}
            </TerminalLine>
            <TerminalLine>
                <SuccessText>{getBar(percentage)}</SuccessText>
            </TerminalLine>
        </div>
    );
};
```

- [ ] **Step 2: Refactor ContentProgressBar to use TerminalProgressBar**

Replace the body of `src/components/design-system/organism/reading-content-progress-bar.tsx` with:

```tsx
"use client";

import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import {
    ScrollDirection,
    useScrollDirection,
} from "@/components/design-system/utils/hooks/use-scroll-direction";
import React from "react";
import { useReadingProgress } from "../utils/hooks/use-reading-progress";
import { useReducedMotions } from "@/components/design-system/utils/hooks/use-reduced-motions";
import { motion } from "framer-motion";
import { TerminalProgressBar } from "../molecules/terminal-progress-bar/terminal-progress-bar";

interface ContentProgressBarProps {
    contentId: string;
}

export const ContentProgressBar: React.FC<ContentProgressBarProps> = ({ contentId }) => {
    const shouldReduceMotion = useReducedMotions();
    const { glassmorphismClass } = useGlassmorphism();
    const { percentage, started, status } = useReadingProgress(contentId);
    const direction = useScrollDirection();
    const isVisible = started && direction === ScrollDirection.down;

    const progressPercentage = status === "complete" ? 100 : percentage;

    return (
        <motion.div
            key="content-progress-bar"
            className={`${glassmorphismClass} container-fixed fixed top-0 right-0 left-0 z-60 rounded-tl-none rounded-tr-none border-t-0 px-0 py-2`}
            initial={false}
            animate={{
                y: isVisible ? 0 : -100,
                pointerEvents: isVisible ? "auto" : "none",
                transition: { delay: 0.1, duration: 0.4, ease: "linear" },
            }}
            style={{ pointerEvents: isVisible ? "auto" : "none" }}
        >
            <TerminalProgressBar
                percentage={progressPercentage}
                loadingMessage="Uploading knowledge..."
                completeMessage="Transfer complete."
                shouldReduceMotion={shouldReduceMotion}
            />
        </motion.div>
    );
};
```

- [ ] **Step 3: Verify build and visual parity**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

Run: `cd agent && npm run build`
Expected: build succeeds. The reading progress bar should look and behave identically to before.

- [ ] **Step 4: Commit**

```bash
cd agent && git add src/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar.tsx src/components/design-system/organism/reading-content-progress-bar.tsx && git commit -m "refactor: extract TerminalProgressBar from ContentProgressBar"
```

---

### Task 4: Create Accordion molecule

**Files:**
- Create: `src/components/design-system/molecules/accordion/accordion.tsx`

- [ ] **Step 1: Create the Accordion component**

Create `src/components/design-system/molecules/accordion/accordion.tsx`:

```tsx
"use client";

import { FC, ReactNode, useId, useState } from "react";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";

interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
    onToggle?: () => void;
}

export const Accordion: FC<AccordionProps> = ({
    title,
    children,
    defaultOpen = false,
    className,
    onToggle,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = useId();
    const panelId = `accordion-panel-${id}`;
    const triggerId = `accordion-trigger-${id}`;

    const toggle = () => {
        setIsOpen((prev) => !prev);
        onToggle?.();
    };

    return (
        <div className={className}>
            <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={toggle}
                className="flex w-full cursor-pointer items-center justify-between bg-transparent p-0 text-left text-primary-text"
            >
                <div className="flex-1">{title}</div>
                <MotionDiv
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 text-accent"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </MotionDiv>
            </button>
            <MotionDiv
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="pt-3">{children}</div>
            </MotionDiv>
        </div>
    );
};
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/components/design-system/molecules/accordion/accordion.tsx && git commit -m "feat: add Accordion molecule to design system"
```

---

### Task 5: Extract useDeviceCapabilities and refactor useReducedMotions

**Files:**
- Create: `src/components/design-system/utils/hooks/use-device-capabilities.ts`
- Modify: `src/components/design-system/utils/hooks/use-reduced-motions.ts`

- [ ] **Step 1: Create useDeviceCapabilities hook**

Create `src/components/design-system/utils/hooks/use-device-capabilities.ts`:

```typescript
import { useEffect, useState } from "react";

interface NavigatorWithDevice extends Navigator {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
}

interface DeviceCapabilities {
    deviceMemory: number;
    cores: number;
    saveData: boolean;
    isLowEnd: boolean;
}

const defaults: DeviceCapabilities = {
    deviceMemory: 4,
    cores: 4,
    saveData: false,
    isLowEnd: false,
};

export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>(defaults);

    useEffect(() => {
        const nav = navigator as NavigatorWithDevice;
        const deviceMemory = nav.deviceMemory ?? 4;
        const cores = nav.hardwareConcurrency ?? 4;
        const saveData = nav.connection?.saveData ?? false;
        const isLowEnd = deviceMemory <= 2 || cores <= 2 || saveData;

        setCapabilities({ deviceMemory, cores, saveData, isLowEnd });
    }, []);

    return capabilities;
}
```

- [ ] **Step 2: Refactor useReducedMotions**

Replace the contents of `src/components/design-system/utils/hooks/use-reduced-motions.ts` with:

```typescript
import { useMotionStore } from "./use-motion-store";
import { useDeviceCapabilities } from "./use-device-capabilities";

export function useReducedMotions() {
    const motionEnabled = useMotionStore();
    const { isLowEnd } = useDeviceCapabilities();

    return !motionEnabled || isLowEnd;
}
```

- [ ] **Step 3: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

Run: `cd agent && npm run build`
Expected: build succeeds. `useReducedMotions` behavior is unchanged.

- [ ] **Step 4: Commit**

```bash
cd agent && git add src/components/design-system/utils/hooks/use-device-capabilities.ts src/components/design-system/utils/hooks/use-reduced-motions.ts && git commit -m "refactor: extract useDeviceCapabilities from useReducedMotions"
```

---

## Chunk 2: Summarizer Hook & Feature Components

### Task 6: Create useChromeSummarize hook

**Files:**
- Create: `src/components/sections/blog/hooks/use-chrome-summarize.ts`

- [ ] **Step 1: Create the hook**

Create `src/components/sections/blog/hooks/use-chrome-summarize.ts`:

```typescript
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDeviceCapabilities } from "@/components/design-system/utils/hooks/use-device-capabilities";

type SummaryType = "tldr" | "key-points";
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
    const cacheRef = useRef<Map<SummaryType, string>>(new Map());

    useEffect(() => {
        const checkAvailability = async () => {
            if (!("Summarizer" in self)) return;
            if (deviceMemory < 8) return;

            try {
                const availability = await Summarizer.availability();
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
        abort();
        setStatus("idle");
        setResult("");
        setDownloadProgress(0);
    }, [abort]);

    const summarize = useCallback(async (type: SummaryType, text: string) => {
        const cached = cacheRef.current.get(type);
        if (cached) {
            setResult(cached);
            setStatus("done");
            return;
        }

        abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            let summarizer = summarizersRef.current.get(type);
            if (!summarizer) {
                setStatus("downloading");
                setDownloadProgress(0);

                summarizer = await Summarizer.create({
                    type,
                    format: "markdown",
                    length: "long",
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

            const stream = summarizer.summarizeStreaming(text, {
                signal: controller.signal,
            });

            setStatus("streaming");
            let fullText = "";

            for await (const chunk of stream) {
                if (controller.signal.aborted) return;
                fullText = chunk;
                setResult(fullText);
            }

            cacheRef.current.set(type, fullText);
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
```

**Important note on types:** The Chrome Summarizer API types (`Summarizer`, `AISummarizer`, `AICreateMonitor`, `DownloadProgressEvent`) are not in DefinitelyTyped. If TypeScript complains, add a type declaration file at `src/types/chrome-ai.d.ts`:

```typescript
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
```

- [ ] **Step 2: Create type declarations if needed**

If `npx tsc --noEmit` shows errors about `Summarizer` not being found, create `src/types/chrome-ai.d.ts` with the content above.

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/components/sections/blog/hooks/use-chrome-summarize.ts src/types/chrome-ai.d.ts && git commit -m "feat: add useChromeSummarize hook with streaming and download monitoring"
```

---

### Task 7: Create ChromeSummaryModal

**Files:**
- Create: `src/components/sections/blog/components/chrome-summary-modal.tsx`

- [ ] **Step 1: Create the modal component**

Create `src/components/sections/blog/components/chrome-summary-modal.tsx`:

```tsx
"use client";

import { Button } from "@/components/design-system/atoms/buttons/button";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { Loader } from "@/components/design-system/atoms/loader/loader";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar";
import { useReducedMotions } from "@/components/design-system/utils/hooks/use-reduced-motions";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { Variants } from "framer-motion";
import { FC, useEffect } from "react";

const modalVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

type ModalStatus = "downloading" | "loading" | "streaming" | "done" | "error";

interface ChromeSummaryModalProps {
    title: string;
    content: string;
    status: ModalStatus;
    downloadProgress: number;
    onClose: () => void;
    onRetry: () => void;
}

export const ChromeSummaryModal: FC<ChromeSummaryModalProps> = ({
    title,
    content,
    status,
    downloadProgress,
    onClose,
    onRetry,
}) => {
    const shouldReduceMotion = useReducedMotions();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <Overlay onClick={onClose} delay={0.15}>
            <MotionDiv
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl bg-general-background p-8 w-[90%] sm:w-[70%] md:w-[60%] max-h-[80vh] overflow-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-bold text-accent">{title}</h2>

                {status === "downloading" && (
                    <TerminalProgressBar
                        percentage={downloadProgress}
                        loadingMessage="Downloading AI model..."
                        completeMessage="Model ready."
                        shouldReduceMotion={shouldReduceMotion}
                    />
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <Loader size="lg" />
                        <p className="text-sm text-primary-text">Generating summary...</p>
                    </div>
                )}

                {(status === "streaming" || status === "done") && (
                    <div
                        aria-live="polite"
                        className="w-full whitespace-pre-wrap text-primary-text leading-relaxed"
                    >
                        {content}
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-3 py-4">
                        <p className="text-confirm">Something went wrong. Please try again.</p>
                        <Button onClick={onRetry}>
                            <p>Retry</p>
                        </Button>
                    </div>
                )}

                <Button
                    className="relative mt-6 text-primary-text"
                    onClick={onClose}
                >
                    <p>Close</p>
                </Button>
            </MotionDiv>
        </Overlay>
    );
};
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/components/sections/blog/components/chrome-summary-modal.tsx && git commit -m "feat: add ChromeSummaryModal component"
```

---

### Task 8: Create ChromeAiFeaturesToolbar

**Files:**
- Create: `src/components/sections/blog/components/chrome-ai-features-toolbar.tsx`

- [ ] **Step 1: Create the toolbar component**

Create `src/components/sections/blog/components/chrome-ai-features-toolbar.tsx`:

```tsx
"use client";

import { FC, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "@/components/design-system/molecules/accordion/accordion";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { tracking } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";
import { useChromeSummarize } from "../hooks/use-chrome-summarize";
import { ChromeSummaryModal } from "./chrome-summary-modal";

type SummaryType = "tldr" | "key-points";

interface ChromeAiFeaturesToolbarProps {
    contentContainerId: string;
}

export const ChromeAiFeaturesToolbar: FC<ChromeAiFeaturesToolbarProps> = ({
    contentContainerId,
}) => {
    const { isAvailable, status, result, downloadProgress, summarize, reset } = useChromeSummarize();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [activeSummaryType, setActiveSummaryType] = useState<SummaryType>("tldr");

    const handleSummarize = useCallback((type: SummaryType) => {
        const container = document.getElementById(contentContainerId);
        if (!container) return;

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
        summarize(type, text);
    }, [contentContainerId, summarize]);

    const handleClose = useCallback(() => {
        setModalOpen(false);
        reset();
    }, [reset]);

    const handleRetry = useCallback(() => {
        const container = document.getElementById(contentContainerId);
        if (!container) return;
        summarize(activeSummaryType, container.innerText);
    }, [contentContainerId, activeSummaryType, summarize]);

    if (!isAvailable) return null;

    return (
        <>
            <Accordion
                title={
                    <div>
                        <p className="text-sm font-bold text-accent">AI features</p>
                        <p className="text-xs text-primary-text">
                            {"These features require "}
                            <StandardExternalLinkWithTracking
                                href="https://developer.chrome.com/docs/ai/built-in"
                                trackingData={{
                                    action: tracking.action.open_chrome_ai_docs,
                                    category: tracking.category.blog_post,
                                    label: tracking.label.body,
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent underline"
                            >
                                Chrome 138+
                            </StandardExternalLinkWithTracking>
                            {" and capable hardware to run."}
                        </p>
                    </div>
                }
                onToggle={() => {
                    trackWith({
                        action: tracking.action.toggle_chrome_ai_features,
                        category: tracking.category.blog_post,
                        label: tracking.label.body,
                    });
                }}
                className="my-4"
            >
                <div className="flex gap-3">
                    <Button onClick={() => handleSummarize("tldr")}>
                        <p>TL;DR</p>
                    </Button>
                    <Button onClick={() => handleSummarize("key-points")}>
                        <p>Key Points</p>
                    </Button>
                </div>
            </Accordion>

            <AnimatePresence>
                {modalOpen && (
                    <ChromeSummaryModal
                        title={modalTitle}
                        content={result}
                        status={status === "idle" ? "loading" : status}
                        downloadProgress={downloadProgress}
                        onClose={handleClose}
                        onRetry={handleRetry}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd agent && git add src/components/sections/blog/components/chrome-ai-features-toolbar.tsx && git commit -m "feat: add ChromeAiFeaturesToolbar component"
```

---

### Task 9: Integrate toolbar into blog-post-content.tsx

**Files:**
- Modify: `src/components/sections/blog/components/blog-post-content.tsx:1-44`

- [ ] **Step 1: Add toolbar import and usage**

In `src/components/sections/blog/components/blog-post-content.tsx`:

Add import at line 12 (after the `RecentPosts` import):
```typescript
import { ChromeAiFeaturesToolbar } from "./chrome-ai-features-toolbar";
```

Add the toolbar component after `PostMeta` in `beforeContent` (line 43, after the `/>` closing `PostMeta`):
```tsx
            <PostMeta
              date={frontmatter.date.formatted}
              readingTime={readingTime.text}
            />
            <ChromeAiFeaturesToolbar contentContainerId="reading-content-container" />
```

- [ ] **Step 2: Verify build**

Run: `cd agent && npx tsc --noEmit`
Expected: no errors

Run: `cd agent && npm run build`
Expected: build succeeds

- [ ] **Step 3: Manual smoke test**

Run: `cd agent && npm run dev -- -p 3001`

Open http://localhost:3001/blog/post/... in Chrome. Verify:
1. If on Chrome 138+ with capable hardware: accordion "AI features" appears below date/reading time
2. If not: nothing appears (progressive enhancement)
3. Click accordion → expands with disclaimer and two buttons
4. Click "TL;DR" → modal opens with download progress or loader, then streaming text
5. Close modal → modal closes cleanly

- [ ] **Step 4: Commit**

```bash
cd agent && git add src/components/sections/blog/components/blog-post-content.tsx && git commit -m "feat: integrate Chrome AI features toolbar into blog posts"
```
