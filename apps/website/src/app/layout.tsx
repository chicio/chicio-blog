import "./css/globals.css";

import Head from "next/head";
import { Viewport } from "next";
import { ReactNode } from "react";
import { Open_Sans, Courier_Prime } from "next/font/google";
import { SerwistProvider } from "@/components/features/pwa/serwist-provider";
import { LayoutAdditionalContent } from "@/components/features/layout-additional-content";
import { AppRootBoundary } from "@/components/features/terminal/app-root-boundary";

export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
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
        <SerwistProvider>
          <AppRootBoundary>{children}</AppRootBoundary>
          <LayoutAdditionalContent />
        </SerwistProvider>
      </body>
    </html>
  );
}
