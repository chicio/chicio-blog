"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { writePwaInstallDecision } from "@/lib/pwa/pwa-install-decision";
import { usePwaInstallDecision } from "./use-pwa-install-decision";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface UseInstallPromptResult {
    isInstallable: boolean;
    isInstalled: boolean;
    promptInstall: () => Promise<void>;
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
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

const getStandaloneServerSnapshot = () => false;

export function useInstallPrompt(): UseInstallPromptResult {
    const isStandalone = useSyncExternalStore(
        subscribeStandaloneMode,
        getStandaloneSnapshot,
        getStandaloneServerSnapshot,
    );
    const decision = usePwaInstallDecision();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    const isInstalled = isStandalone || decision === "installed";
    const isInstallable = deferredPrompt !== null && decision === null && !isInstalled;

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

    const promptInstall = async () => {
        if (!deferredPrompt) {
            return;
        }

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        writePwaInstallDecision(outcome === "accepted" ? "installed" : "dismissed");
        setDeferredPrompt(null);
    };

    const dismiss = () => {
        writePwaInstallDecision("dismissed");
        setDeferredPrompt(null);
    };

    return { isInstallable, isInstalled, promptInstall, dismiss };
}
