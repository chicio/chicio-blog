import "./css/globals.css";

import { FloatingChatButton } from "@/components/design-system/molecules/buttons/chat-button";
import { ThemePage } from "@/components/design-system/templates/theme-page";
import { theme } from "@/components/design-system/themes/theme";
import { CookieConsentBanner } from "@/components/design-system/organism/cookie-consent-banner";
import Head from "next/head";
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
      <Head>
        <link rel="author" href="/humans.txt" type="text/plain" />
      </Head>
      <body>
        <StyledComponentsRegistry>
          <ThemePage theme={theme}>
            {children}
            <div className="fixed right-3 bottom-3 z-40 flex flex-col gap-4 md:right-9 md:bottom-5">
              <MotionButton />
              <FloatingChatButton />
            </div>
            <CookieConsentBanner />
          </ThemePage>
        </StyledComponentsRegistry>
        <TrackingOptIn />
      </body>
    </html>
  );
}
