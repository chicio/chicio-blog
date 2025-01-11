import {ReactNode} from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import {ThemePage} from "@/components/design-system/templates/theme-page";
import {blogTheme} from "@/components/design-system/themes/theme";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
            <ThemePage theme={blogTheme}>
                {children}
            </ThemePage>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
