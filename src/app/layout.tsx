import "./css/globals.css";

import { FloatingChatButton } from "@/components/design-system/molecules/buttons/chat-button";
import { ThemePage } from "@/components/design-system/templates/theme-page";
import { theme } from "@/components/design-system/themes/theme";
import { CookieConsentBanner } from "@/components/design-system/organism/cookie-consent-banner";
import { SharedHead } from "@/components/design-system/utils/components/share-head";
import StyledComponentsRegistry from "@/components/styled-components-registry";
import { TrackingOptIn } from "@/components/design-system/organism/tracking-optin";
import { Viewport } from "next";
import { ReactNode } from "react";
import { Open_Sans, Courier_Prime } from "next/font/google";
import { MotionButton } from "@/components/design-system/molecules/buttons/motion-button";

export const openSans = Open_Sans({
  subsets: ["latin"],
});

export const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${courierPrime.className} ${openSans.className}`}
    >
      <SharedHead />
      <body>
        <StyledComponentsRegistry>
          <ThemePage theme={theme}>
            {children}
            <div className="fixed right-3 bottom-3 z-40 md:right-9 md:bottom-5">
              <FloatingChatButton />
            </div>
            <div className="fixed bottom-3 left-3 z-40 md:bottom-5 md:left-9">
              <MotionButton />
            </div>
            <CookieConsentBanner />
          </ThemePage>
        </StyledComponentsRegistry>
        <TrackingOptIn />
      </body>
    </html>
  );
}
