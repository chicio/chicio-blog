"use client";

import { FC } from "react";
import { AnimatePresence } from "framer-motion";
import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { useInstallPromptBannerStore } from "./use-install-prompt-banner-store";

export const InstallPromptBanner: FC = () => {
    const { state, effects } = useInstallPromptBannerStore();
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <AnimatePresence>
            {state.visible && (
                <div
                    className={`${glassmorphismClass} backdrop-blur-2xl! fixed right-0 bottom-5 left-0 mx-auto my-0 p-4 flex max-w-[95%] flex-col items-center gap-4 lg:max-w-[60%] lg:flex-row z-50`}
                    role="dialog"
                    aria-live="polite"
                    aria-label="Install app banner"
                >
                    <p className="text-shadow-md">
                        <span className="text-primary">&gt; PORTABLE_VERSION_AVAILABLE</span>
                        {" — "}
                        Install this site as an app for offline access and a faster experience.
                    </p>
                    <div className="flex flex-row gap-4">
                        <BluePillButton
                            onClick={effects.dismiss}
                            aria-label="Dismiss install prompt"
                        >
                            Dismiss
                        </BluePillButton>
                        <RedPillButton
                            onClick={effects.install}
                            aria-label="Install app"
                        >
                            Install
                        </RedPillButton>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};
