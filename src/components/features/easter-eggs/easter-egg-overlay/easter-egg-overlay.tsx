"use client";

import { FC } from "react";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain/matrix-rain";
import { SelfHostedVideo } from "@/components/design-system/molecules/video/self-hosted-video";
import { BootTerminal } from "./boot-terminal";
import { useEasterEggOverlayStore } from "./use-easter-egg-overlay-store";

const CARD_CLASS = [
    "glow-border relative flex w-full max-w-[720px] max-h-[92vh] flex-col overflow-y-auto",
    "gap-[clamp(12px,3vw,16px)] bg-black-alpha-75 p-[clamp(14px,4vw,22px)] backdrop-blur-[6px]",
].join(" ");

const CLOSE_BUTTON_CLASS = [
    "border-accent-alpha-25 hover:border-accent flex min-h-11 min-w-11 items-center",
    "justify-center rounded-md border border-solid font-mono text-xs text-accent",
].join(" ");

const VIDEO_CLASS = [
    "aspect-[640/267] w-full rounded-xl border border-solid",
    "border-accent-alpha-40 shadow-lg",
].join(" ");

export const EasterEggOverlay: FC = () => {
    const { state, effects } = useEasterEggOverlayStore();
    const { entry, bootComplete, reducedMotion, skipSignal } = state;
    const { close, handleCardClick, handleBootComplete, setContainerEl } = effects;

    if (!entry) {
        return null;
    }

    const popClassName = reducedMotion ? "" : "animate-ee-pop";

    return (
        <Overlay delay={0} onClick={close} className="z-60">
            <div
                ref={setContainerEl}
                role="dialog"
                aria-modal="true"
                aria-label={entry.title}
                tabIndex={-1}
                className="fixed inset-0 flex items-center justify-center px-4 outline-none"
            >
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-[0.55]">
                    <MatrixRain />
                </div>
                <div onClick={handleCardClick} className={`${CARD_CLASS} ${popClassName}`}>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-accent wrap-anywhere font-mono text-[13px] uppercase tracking-[.1em]">
                            {entry.slug}
                        </span>
                        <button type="button" onClick={close} aria-label="Close" className={CLOSE_BUTTON_CLASS}>
                            esc
                        </button>
                    </div>

                    <BootTerminal
                        key={entry.slug}
                        slug={entry.slug}
                        reducedMotion={reducedMotion}
                        skipSignal={skipSignal}
                        onBootComplete={handleBootComplete}
                    />

                    <div
                        className={
                            bootComplete
                                ? `${popClassName} [animation-duration:0.3s]`
                                : "pointer-events-none absolute -z-10 opacity-0"
                        }
                    >
                        <SelfHostedVideo
                            src={entry.videoSrc}
                            poster={entry.poster}
                            captions={entry.captions}
                            autoPlay
                            ariaLabel={entry.title}
                            className={VIDEO_CLASS}
                        />
                        <p className="mt-3 font-mono text-[15px] text-accent">{entry.title}</p>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};
