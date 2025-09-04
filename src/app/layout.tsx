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
import { MotionConfig } from "framer-motion";

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
        <MotionConfig reducedMotion="user">
          <StyledComponentsRegistry>
            <ThemePage theme={theme}>
              {children}
              <FloatingChatButton />
              <CookieConsentBanner />
            </ThemePage>
          </StyledComponentsRegistry>
          <TrackingOptIn />
        </MotionConfig>
      </body>
    </html>
  );
}
