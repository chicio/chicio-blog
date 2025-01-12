import {ReactNode} from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import {ThemePage} from "@/components/templates/theme-page";
import {blogTheme} from "@/components/design-system/themes/theme";
import {CookieConsent} from "@/components/website/CookieConsent";
import {Viewport} from "next";
import {createMetadata} from "@/lib/seo";
import {siteMetadata} from "@/types/site-metadata";
import {SharedHead} from "@/components/website/SharedHead";

export const metadata = createMetadata({
        author: siteMetadata.author,
        title: siteMetadata.title,
        url: siteMetadata.siteUrl,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: 'website',
    })

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
        <SharedHead />
        <body>
        <StyledComponentsRegistry>
            <ThemePage theme={blogTheme}>
                {children}
            </ThemePage>
            <CookieConsent/>
        </StyledComponentsRegistry>
        </body>
        </html>
    );
}
