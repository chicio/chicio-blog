"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { searchIndexFileName } from "@/lib/content/search-filename";
import { slugs } from "@/types/configuration/slug";
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
        import("@/components/features/tracking/tracking-optin").then(
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

const MatrixRainControlPanel = dynamic(
    () =>
        import("@/components/features/matrix-rain-panel/matrix-rain-control-panel").then(
            (m) => m.MatrixRainControlPanel,
        ),
    { ssr: false },
);

const Terminal = dynamic(
    () => import("@/components/features/terminal/terminal").then((m) => m.Terminal),
    { ssr: false },
);

const EasterEggOverlay = dynamic(
    () =>
        import("@/components/features/easter-eggs/easter-egg-overlay").then(
            (m) => m.EasterEggOverlay,
        ),
    { ssr: false },
);

const EasterEggTriggers = dynamic(
    () =>
        import("@/components/features/easter-eggs/easter-egg-triggers").then(
            (m) => m.EasterEggTriggers,
        ),
    { ssr: false },
);

const Lightbox = dynamic(
    () => import("@/components/design-system/organism/lightbox").then((m) => m.Lightbox),
    { ssr: false },
);

export const LayoutAdditionalContent: FC = () => {
    const { state, effects } = useLayoutAdditionalContentStore();
    const { consented, decided } = state;
    const {
        acceptConsent,
        rejectConsent,
        trackCommandPaletteOpen,
        trackCommandPaletteOpenChat,
        trackCommandPaletteSearchResultSelect,
        trackCommandPaletteToggleMotion,
        trackCommandPaletteCustomizeMatrixRain,
        trackCommandPaletteOpenEasterEggHunt,
        trackCommandPaletteOpenTerminal,
        matchesEasterEggQuery,
        handleEasterEggQueryMatch,
    } = effects;

    return (
        <>
            <CommandPalette
                searchIndexFileName={searchIndexFileName}
                chatSlug={slugs.chat}
                easterEggHuntSlug={slugs.easterEggHunt}
                tracking={{
                    onOpen: trackCommandPaletteOpen,
                    onOpenChat: trackCommandPaletteOpenChat,
                    onSearchResultSelect: trackCommandPaletteSearchResultSelect,
                    onToggleMotion: trackCommandPaletteToggleMotion,
                    onCustomizeMatrixRain: trackCommandPaletteCustomizeMatrixRain,
                    onOpenEasterEggHunt: trackCommandPaletteOpenEasterEggHunt,
                    onOpenTerminal: trackCommandPaletteOpenTerminal,
                }}
                matchesEasterEggQuery={matchesEasterEggQuery}
                onEasterEggMatch={handleEasterEggQueryMatch}
            />
            <MatrixRainControlPanel />
            <Terminal />
            <EasterEggOverlay />
            <EasterEggTriggers />
            <Lightbox />
            <CookieConsentBanner decided={decided} onAccept={acceptConsent} onReject={rejectConsent} />
            <TrackingOptIn enabled={consented} />
            <InstallPromptBanner />
        </>
    );
};
