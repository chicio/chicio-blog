"use client";

import { SerwistProvider as BaseSerwistProvider } from "@serwist/next/react";
import { ReactNode } from "react";

export function SerwistProvider({ children }: { children: ReactNode }) {
    return (
        <BaseSerwistProvider swUrl="/sw.js">
            {children}
        </BaseSerwistProvider>
    );
}
