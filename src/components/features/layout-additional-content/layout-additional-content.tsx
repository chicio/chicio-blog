"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { whiteRabbitEasterEgg } from "@/components/features/easter-eggs/white-rabbit";
import { searchIndexFileName } from "@/lib/content/search-filename";
import { useLayoutAdditionalContentStore } from "./use-layout-additional-content-store";

const CookieConsentBanner = dynamic(
    () =>
        import("@/components/design-system/organism/cookie-consent-banner").then(
            (m) => m.CookieConsentBanner,
        ),
    { ssr: false },
);

const TrackingOptIn = dynamic(
    () =>
        import("@/components/design-system/organism/tracking-optin").then(
            (m) => m.TrackingOptIn,
        ),
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
    const { state } = useLayoutAdditionalContentStore();
    const { consented, decided } = state;

    return (
        <>
            <CommandPalette
                searchIndexFileName={searchIndexFileName}
                searchEasterEgg={whiteRabbitEasterEgg}
                SearchEasterEggComponent={NeoRoomEasterEgg}
            />
            <MatrixRainControlPanel />
            <CookieConsentBanner decided={decided} />
            <TrackingOptIn enabled={consented} />
            <InstallPromptBanner />
        </>
    );
};
