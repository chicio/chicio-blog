'use client'

import Script from 'next/script'
import {FC} from "react";
import {
  matrixPrimaryGreen,
} from "@/components/design-system/themes/blog-colors";

export const CookieConsent: FC = () =>
    (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (typeof window !== 'undefined') {
                        window.cookieconsent.initialise({
                            palette: {
                                popup: {background: `${matrixPrimaryGreen}`, text: '#fff'},
                                button: {background: '#0F67FF'},
                            },
                            theme: 'classic',
                            content: {
                                message: 'This website uses cookies to ensure you get the best experience on our website.',
                                dismiss: 'Got it!',
                                link: 'Learn more about cookie policy',
                                href: '/cookie-policy',
                            },
                        })
                    }
                }}
            />
        </>
    )
