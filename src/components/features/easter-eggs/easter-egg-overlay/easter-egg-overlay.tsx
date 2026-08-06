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

/**
 * The clip fades in, and deliberately keeps its full layout size while hidden.
 *
 * It must stay mounted AND laid out from the moment the overlay opens: mounting early is what keeps
 * the play attempt inside the user-activation window that permits unmuted autoplay, and Chrome will
 * not start autoplay on a zero-size element — collapsing the space (via a `0fr` grid row, say) leaves
 * the video paused at 0 and pushes the real play attempt away from the gesture that authorised it.
 *
 * Reserving the space also means the card never changes height, so the reveal is a pure crossfade
 * with no reflow.
 */
const REVEAL_TRANSITION_CLASS = "transition-opacity duration-500 ease-out";
const REVEALED_CLASS = "opacity-100";
const HIDDEN_CLASS = "pointer-events-none opacity-0";

export const EasterEggOverlay: FC = () => {
    const { state, effects } = useEasterEggOverlayStore();
    const { entry, bootComplete, reducedMotion, skipSignal } = state;
    const { close, handleCardClick, handleBootComplete, setContainerEl, setVideoEl } = effects;

    if (!entry) {
        return null;
    }

    const popClassName = reducedMotion ? "" : "animate-ee-pop";
    const revealTransitionClass = reducedMotion ? "" : REVEAL_TRANSITION_CLASS;

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

                    <div className={`${revealTransitionClass} ${bootComplete ? REVEALED_CLASS : HIDDEN_CLASS}`}>
                        <SelfHostedVideo
                            src={entry.videoSrc}
                            poster={entry.poster}
                            captions={entry.captions}
                            autoPlay
                            muted={!bootComplete}
                            videoRef={setVideoEl}
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
