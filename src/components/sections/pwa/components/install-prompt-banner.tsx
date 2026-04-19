"use client";

import { FC, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";

const COOKIE_CONSENT_KEY = "fabrizioduroni_cookieConsent";

export const InstallPromptBanner: FC = () => {
    const { glassmorphismClass } = useGlassmorphism();
    const { isInstallable, promptInstall, dismiss } = useInstallPrompt();
    const [cookieConsentDone, setCookieConsentDone] = useState(false);

    useEffect(() => {
        // Defer to next tick so any in-flight click handler (cookie banner accept/reject)
        // has already written to localStorage before we read it.
        const check = () => {
            setTimeout(() => {
                setCookieConsentDone(localStorage.getItem(COOKIE_CONSENT_KEY) !== null);
            }, 0);
        };

        check();

        // Same-tab: re-check after any click (catches cookie banner buttons)
        document.addEventListener("click", check, true);
        // Cross-tab: re-check when another tab writes consent
        window.addEventListener("storage", check);

        return () => {
            document.removeEventListener("click", check, true);
            window.removeEventListener("storage", check);
        };
    }, []);

    const visible = isInstallable && cookieConsentDone;

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
                        <span className="text-confirm">&gt; PORTABLE_VERSION_AVAILABLE</span>
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
