import "./css/globals.css";

import Head from "next/head";
import { Viewport } from "next";
import { ReactNode } from "react";
import { Open_Sans, Courier_Prime } from "next/font/google";
import { LayoutAdditionalContent } from "@/components/design-system/templates/layout-additional-content";

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
        {children}
        <LayoutAdditionalContent />
      </body>
    </html>
  );
}
