"use client";

import { FC } from "react";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain/matrix-rain";
import { SelfHostedVideo } from "@/components/design-system/molecules/video/self-hosted-video";
import { Cursor, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useEasterEggOverlayStore } from "./use-easter-egg-overlay-store";

export const EasterEggOverlay: FC = () => {
    const { state, effects } = useEasterEggOverlayStore();
    const { entry, completedBootLines, activeBootLine, bootComplete, reducedMotion } = state;
    const { close, handleCardClick, setCloseButtonEl } = effects;

    if (!entry) {
        return null;
    }

    const popClassName = reducedMotion ? "" : "animate-ee-pop";

    return (
        <Overlay delay={0} onClick={close} className="z-60">
            <div
                role="dialog"
                aria-modal="true"
                aria-label={entry.title}
                className="fixed inset-0 flex items-center justify-center px-4"
            >
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-[0.55]">
                    <MatrixRain />
                </div>
                <div
                    onClick={handleCardClick}
                    className={`glow-border relative flex w-full max-w-[720px] max-h-[92vh] flex-col overflow-y-auto gap-[clamp(12px,3vw,16px)] bg-black-alpha-75 p-[clamp(14px,4vw,22px)] backdrop-blur-[6px] ${popClassName}`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-accent wrap-anywhere font-mono text-[13px] uppercase tracking-[.1em]">
                            {entry.slug}
                        </span>
                        <button
                            ref={setCloseButtonEl}
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="border-accent-alpha-25 hover:border-accent flex min-h-11 min-w-11 items-center justify-center rounded-md border border-solid font-mono text-xs text-accent"
                        >
                            esc
                        </button>
                    </div>

                    <div className="min-h-24">
                        {completedBootLines.map((line, index) => (
                            <TerminalLine key={`${entry.slug}-boot-${index}`}>{line}</TerminalLine>
                        ))}
                        {!bootComplete && (
                            <TerminalLine>
                                {activeBootLine}
                                <Cursor />
                            </TerminalLine>
                        )}
                    </div>

                    <div className={bootComplete ? popClassName : "pointer-events-none absolute -z-10 opacity-0"}>
                        <SelfHostedVideo
                            src={entry.videoSrc}
                            poster={entry.poster}
                            captions={entry.captions}
                            autoPlay
                            ariaLabel={entry.title}
                            className="aspect-[640/267] w-full rounded-xl border border-solid border-accent-alpha-40 shadow-lg"
                        />
                        <p className="mt-3 font-mono text-[15px] text-accent">{entry.title}</p>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};
