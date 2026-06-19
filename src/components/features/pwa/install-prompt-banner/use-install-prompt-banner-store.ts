"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useConsentStore } from "@/components/design-system/utils/hooks/use-consent-store";
import { writePwaInstallDecision } from "@/lib/pwa/pwa-install-decision";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { ComponentStore } from "@/types/component-store";
import { usePwaInstallDecision } from "./use-pwa-install-decision";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptBannerState {
    visible: boolean;
}

interface InstallPromptBannerEffects {
    install: () => Promise<void>;
    dismiss: () => void;
}

const subscribeStandaloneMode = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
};

const getStandaloneSnapshot = () =>
    typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches;

const getStandaloneServerSnapshot = () => false;

export const useInstallPromptBannerStore = (): ComponentStore<
    InstallPromptBannerState,
    InstallPromptBannerEffects
> => {
    const cookieAccepted = useConsentStore();
    const decision = usePwaInstallDecision();
    const isStandalone = useSyncExternalStore(
        subscribeStandaloneMode,
        getStandaloneSnapshot,
        getStandaloneServerSnapshot,
    );
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    const isInstalled = isStandalone || decision === "installed";
    const isInstallable = deferredPrompt !== null && decision === null && !isInstalled;
    const visible = isInstallable && cookieAccepted;

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        const handleAppInstalled = () => {
            writePwaInstallDecision("installed");
            setDeferredPrompt(null);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        if (visible) {
            trackWith({
                action: tracking.action.pwa_install_prompt_shown,
                category: tracking.category.pwa,
                label: tracking.label.body,
            });
        }
    }, [visible]);

    const install = async () => {
        if (!deferredPrompt) {
            return;
        }
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        writePwaInstallDecision(outcome === "accepted" ? "installed" : "dismissed");
        setDeferredPrompt(null);
        trackWith({
            action: tracking.action.pwa_install_accepted,
            category: tracking.category.pwa,
            label: tracking.label.body,
        });
    };

    const dismiss = () => {
        writePwaInstallDecision("dismissed");
        setDeferredPrompt(null);
        trackWith({
            action: tracking.action.pwa_install_dismissed,
            category: tracking.category.pwa,
            label: tracking.label.body,
        });
    };

    return {
        state: { visible },
        effects: { install, dismiss },
    };
};
