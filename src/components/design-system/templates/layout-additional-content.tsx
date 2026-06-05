"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { useOfflineContactQueue } from "@/components/features/pwa/hooks/use-offline-contact-queue";

const CookieConsentBanner = dynamic(
    () => import("@/components/design-system/organism/cookie-consent-banner"),
    { ssr: false },
);

const TrackingOptIn = dynamic(
    () => import("@/components/design-system/organism/tracking-optin"),
    { ssr: false },
);

const InstallPromptBanner = dynamic(
    () =>
        import("@/components/features/pwa/components/install-prompt-banner").then(
            (m) => m.InstallPromptBanner,
        ),
    { ssr: false },
);

const CommandPalette = dynamic(
    () => import("@/components/design-system/organism/command-palette/command-palette"),
    { ssr: false },
);

export const LayoutAdditionalContent: FC = () => {
    useOfflineContactQueue();

    return (
        <>
            <CommandPalette />
            <CookieConsentBanner />
            <TrackingOptIn />
            <InstallPromptBanner />
        </>
    );
};
