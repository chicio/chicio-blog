import { spawnSync } from "node:child_process";
import { serwist } from "@serwist/next/config";

const revision =
    spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
    crypto.randomUUID();

// serwist.withNextConfig receives the fully resolved Next.js config, so
// basePath, distDir, and experimental flags stay in sync automatically.
export default serwist.withNextConfig(async ({ basePath = "" }) => ({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    // Ensure the offline fallback page is always precached regardless of
    // whether the user has visited it.
    additionalPrecacheEntries: [{ url: `${basePath}/offline`, revision }],
    // Exclude large assets from the precache manifest — they are served
    // by the runtime CacheFirst strategy in sw.ts instead.
    // The default glob patterns include public/**/* which would pull in
    // every blog post image, videogame screenshot and the PDF thesis (~290 MB).
    globIgnores: [
        // Large image directory — served by runtime CacheFirst strategy instead
        "public/images/**",
        // Oversized standalone files that exceed the 2 MB precache limit anyway
        "public/tesi-fabrizio-duroni-770157.pdf",
        "public/chicio-coding-feature-graphic.png",
        "public/chicio-coding-feature-graphic.jpg",
        "public/chicio-art-featured.png",
        // Dynamically generated assets — not useful to precache
        "public/search-index.json",
    ],
}));
