"use client";

import { FC, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { useConsentStore } from "@/components/design-system/utils/hooks/use-consent-store";
import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";

export const InstallPromptBanner: FC = () => {
    const { glassmorphismClass } = useGlassmorphism();
    const { isInstallable, promptInstall, dismiss } = useInstallPrompt();
    const cookieAccepted = useConsentStore();

    const visible = isInstallable && cookieAccepted;

    useEffect(() => {
        if (visible) {
            trackWith({
                action: tracking.action.pwa_install_prompt_shown,
                category: tracking.category.pwa,
                label: tracking.label.body,
            });
        }
    }, [visible]);

    const handleInstall = async () => {
        await promptInstall();
        trackWith({
            action: tracking.action.pwa_install_accepted,
            category: tracking.category.pwa,
            label: tracking.label.body,
        });
    };

    const handleDismiss = () => {
        dismiss();
        trackWith({
            action: tracking.action.pwa_install_dismissed,
            category: tracking.category.pwa,
            label: tracking.label.body,
        });
    };

    return (
        <AnimatePresence>
            {visible && (
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
                            onClick={handleDismiss}
                            aria-label="Dismiss install prompt"
                        >
                            Dismiss
                        </BluePillButton>
                        <RedPillButton
                            onClick={handleInstall}
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

export default InstallPromptBanner;
