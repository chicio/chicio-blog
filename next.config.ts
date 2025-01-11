import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true,
    },
    async redirects() {
        return [
            {
                source: '/blog/:page',
                destination: '/blog/page/:page',
                permanent: true,
            },
            {
                source: '/:year/:month/:day/:slug',
                destination: '/blog/post/:year/:month/:day/:slug',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
