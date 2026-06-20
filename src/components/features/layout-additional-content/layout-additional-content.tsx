"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { whiteRabbitEasterEgg } from "@/components/features/easter-eggs/white-rabbit";
import { useLayoutAdditionalContentStore } from "./use-layout-additional-content-store";

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
        import("@/components/features/pwa/install-prompt-banner").then(
            (m) => m.InstallPromptBanner,
        ),
    { ssr: false },
);

const CommandPalette = dynamic(
    () =>
        import("@/components/design-system/organism/command-palette").then(
            (m) => m.CommandPalette,
        ),
    { ssr: false },
);

const NeoRoomEasterEgg = dynamic(
    () => import("@/components/features/easter-eggs/neo-room-easter-egg"),
    { ssr: false },
);

const MatrixRainControlPanel = dynamic(
    () =>
        import("@/components/features/matrix-rain-panel/matrix-rain-control-panel").then(
            (m) => m.MatrixRainControlPanel,
        ),
    { ssr: false },
);

export const LayoutAdditionalContent: FC = () => {
    useLayoutAdditionalContentStore();

    return (
        <>
            <CommandPalette
                searchEasterEgg={whiteRabbitEasterEgg}
                SearchEasterEggComponent={NeoRoomEasterEgg}
            />
            <MatrixRainControlPanel />
            <CookieConsentBanner />
            <TrackingOptIn />
            <InstallPromptBanner />
        </>
    );
};
