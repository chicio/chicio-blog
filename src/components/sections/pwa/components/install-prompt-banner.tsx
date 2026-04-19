"use client";

import { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { TerminalLine, SuccessText } from "@/components/design-system/atoms/typography/terminal-blocks";
import { RedPillButton, BluePillButton } from "@/components/design-system/molecules/buttons/pills-buttons";

export const InstallPromptBanner: FC = () => {
    const { isInstallable, promptInstall, dismiss } = useInstallPrompt();

    useEffect(() => {
        if (isInstallable) {
            trackWith({
                action: tracking.action.pwa_install_prompt_shown,
                category: tracking.category.pwa,
                label: tracking.label.body,
            });
        }
    }, [isInstallable]);

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
            {isInstallable && (
                <motion.div
                    key="install-banner"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border border-matrix-primary/40 bg-black/85 p-4 shadow-lg shadow-matrix-primary/10 backdrop-blur-md md:bottom-6"
                >
                    <div className="mb-3 flex flex-col gap-1">
                        <TerminalLine>
                            <SuccessText>{`> PORTABLE_VERSION_AVAILABLE`}</SuccessText>
                        </TerminalLine>
                        <TerminalLine>
                            <span className="text-matrix-green/70 text-xs font-mono">
                                Install this site as an app for offline access and a faster experience.
                            </span>
                        </TerminalLine>
                    </div>
                    <div className="flex justify-end gap-3">
                        <BluePillButton onClick={handleDismiss}>
                            Dismiss
                        </BluePillButton>
                        <RedPillButton onClick={handleInstall}>
                            Install
                        </RedPillButton>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
