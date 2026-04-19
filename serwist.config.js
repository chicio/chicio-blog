/** @type {import("@serwist/build").InjectManifestOptions} */
const serwistConfig = {
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    // Scan the Next.js output for files to precache
    globDirectory: ".next",
    globPatterns: [
        "static/chunks/**/*.{js,css}",
        "static/css/**/*.css",
        "static/media/**/*.{woff,woff2,eot,ttf,otf}",
    ],
    // Don't cache-bust hashed filenames (they're already unique)
    dontCacheBustURLsMatching: /^\/_next\/static\/.+$/,
    // Modify URLs to match the expected /_next/... format
    modifyURLPrefix: {
        "static/": "/_next/static/",
    },
    // Exclude large files from precache
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
    // Override esbuild target — Service Workers only run in modern browsers
    esbuildOptions: {
        target: ["chrome96", "edge96", "firefox95", "safari16"],
    },
};

export default serwistConfig;
