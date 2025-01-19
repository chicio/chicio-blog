import { ReactNode } from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { ThemePage } from "@/components/templates/theme-page";
import { blogTheme } from "@/components/design-system/themes/theme";
import { Viewport } from "next";
import { SharedHead } from "@/components/website/share-head";
import { CookieConsent } from "@/components/website/cookie-consent";
import { GoogleTagManager } from "@next/third-parties/google";
import {SpeedInsights} from "@vercel/speed-insights/next";

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
      </body>
    </html>
  );
}
