import {ReactNode} from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import {ThemePage} from "@/components/templates/theme-page";
import {blogTheme} from "@/components/design-system/themes/theme";
import {CookieConsent} from "@/components/website/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
      <StyledComponentsRegistry>
          <ThemePage theme={blogTheme}>
              {children}
          </ThemePage>
          <CookieConsent />
      </StyledComponentsRegistry>
      </body>
    </html>
  );
}
