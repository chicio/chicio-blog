'use client'

import Script from 'next/script'
import {FC} from "react";
import {
} from "@/components/design-system/themes/blog-colors";
import { blogTheme } from '../../themes/theme';

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
                                popup: {background: `${blogTheme.dark.generalBackgroundLight}`, text: '#fff'},
                                button: {background: `${blogTheme.dark.accentColor}`, text: '#000'},
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
