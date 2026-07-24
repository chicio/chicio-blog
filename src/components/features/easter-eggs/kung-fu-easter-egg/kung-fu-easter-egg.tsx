"use client";

import { FC } from "react";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { SelfHostedVideo } from "@/components/design-system/molecules/video/self-hosted-video";
import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { CenterContainer } from "@/components/features/easter-eggs/center-container";
import { useKungFuEasterEggStore } from "./use-kung-fu-easter-egg-store";

export const KungFuEasterEgg: FC = () => {
    const { state, effects } = useKungFuEasterEggStore();
    const { active, isCompleted } = state;
    const { dismiss, registerTap, onComplete, replay, stopClick, setVideoEl } = effects;

    return (
        <>
            <div
                aria-hidden="true"
                data-testid="kung-fu-tap-hotspot"
                onClick={registerTap}
                className="fixed bottom-0 right-0 z-30 h-11 w-11 pointer-events-auto"
            />
            {active && (
                <Overlay delay={0} onClick={dismiss}>
                    <CenterContainer>
                        <SelfHostedVideo
                            src="/media/video/i-know-kung-fu.mp4"
                            poster="/media/video/i-know-kung-fu-poster.jpg"
                            autoPlay
                            onEnded={onComplete}
                            videoRef={setVideoEl}
                            ariaLabel="I know kung fu — Matrix construct loading"
                        />
                        <div onClick={stopClick} style={{ visibility: isCompleted ? "visible" : "hidden" }}>
                            <RedPillButton onClick={replay}>I Know Kung Fu</RedPillButton>
                        </div>
                    </CenterContainer>
                </Overlay>
            )}
        </>
    );
};
