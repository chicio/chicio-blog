"use client";

import { SerwistProvider as BaseSerwistProvider } from "@serwist/turbopack/react";
import { ReactNode } from "react";

export function SerwistProvider({ children }: { children: ReactNode }) {
    return (
        <BaseSerwistProvider swUrl="/serwist/sw.js">
            {children}
        </BaseSerwistProvider>
    );
}
