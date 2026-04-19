"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { useOfflineContactQueue } from "@/components/sections/pwa/hooks/use-offline-contact-queue";

const CookieConsentBanner = dynamic(
  () => import("@/components/design-system/organism/cookie-consent-banner"),
  { ssr: false },
);

const TrackingOptIn = dynamic(
  () => import("@/components/design-system/organism/tracking-optin"),
  { ssr: false },
);

const FloatingChatButton = dynamic(
  () => import("@/components/design-system/molecules/buttons/chat-button"),
  { ssr: false },
);

const MotionButton = dynamic(
  () => import("@/components/design-system/molecules/buttons/motion-button"),
  { ssr: false },
);

const InstallPromptBanner = dynamic(
  () => import("@/components/sections/pwa/components/install-prompt-banner"),
  { ssr: false },
);

export const LayoutAdditionalContent: FC = () => {
  useOfflineContactQueue();

  return (
    <>
      <div className="fixed right-3 bottom-3 z-40 flex flex-col gap-4 md:right-9 md:bottom-5">
        <MotionButton />
        <FloatingChatButton />
      </div>
      <CookieConsentBanner />
      <TrackingOptIn />
      <InstallPromptBanner />
    </>
  );
};
