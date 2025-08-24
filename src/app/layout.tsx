import { FloatingChatButton } from "@/components/design-system/molecules/buttons/chat-button";
import { ThemePage } from "@/components/design-system/templates/theme-page";
import { blogTheme } from "@/components/design-system/themes/theme";
import { CookieConsentBanner } from "@/components/design-system/organism/cookie-consent-banner";
import { SharedHead } from "@/components/design-system/utils/components/share-head";
import StyledComponentsRegistry from "@/components/styled-components-registry";
import { GoogleTagManager } from "@next/third-parties/google";
import { TrackingOptIn } from "@/components/design-system/organism/tracking-optin";
import { Viewport } from "next";
import { ReactNode } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={"G-B992TEM300"} />
      <SharedHead />
      <body>
        <StyledComponentsRegistry>
          <ThemePage theme={blogTheme}>
            {children}
            <FloatingChatButton />
            <CookieConsentBanner />
          </ThemePage>
        </StyledComponentsRegistry>
        <TrackingOptIn />
      </body>
    </html>
  );
}
