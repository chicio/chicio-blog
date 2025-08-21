import { ReactNode } from "react";
import StyledComponentsRegistry from "@/components/styled-components-registry";
import { blogTheme } from "@/components/design-system/themes/theme";
import { Viewport } from "next";
import { SharedHead } from "@/components/design-system/utils/components/share-head";
import { CookieConsent } from "@/components/design-system/utils/components/cookie-consent";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemePage } from "@/components/design-system/templates/theme-page";
import { FloatingChatButton } from "@/components/design-system/molecules/floating-chat-button";

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
          </ThemePage>
          <CookieConsent />
        </StyledComponentsRegistry>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
