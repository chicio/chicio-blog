import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true,
    },
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
    async redirects() {
        return [
            {
                source: '/:year/:month/:day/:slug',
                destination: '/blog/post/:year/:month/:day/:slug',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
