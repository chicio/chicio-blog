import { ReactNode } from "react";
import StyledComponentsRegistry from "@/components/styled-components-registry";
import { ThemePage } from "@/components/templates/theme-page";
import { blogTheme } from "@/components/design-system/themes/theme";
import { Viewport } from "next";
import { SharedHead } from "@/components/design-system/website/share-head";
import { CookieConsent } from "@/components/design-system/website/cookie-consent";
import { GoogleTagManager } from "@next/third-parties/google";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/next";

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
          <ThemePage theme={blogTheme}>{children}</ThemePage>
          <CookieConsent />
        </StyledComponentsRegistry>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
