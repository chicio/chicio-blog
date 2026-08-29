import { spawnSync } from "node:child_process";
import { serwist } from "@serwist/next/config";

const revision =
    spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ?? crypto.randomUUID();

// serwist.withNextConfig receives the fully resolved Next.js config, so
// basePath, distDir, and experimental flags stay in sync automatically.
export default serwist.withNextConfig(async () => ({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    // Only precache the offline fallback page — all other pages are cached
    // at runtime by the NetworkFirst strategy in sw.ts as users navigate.
    // This dramatically reduces Vercel ISR read units (previously 685 entries
    // were precached per visitor per deploy).
    precachePrerendered: false,
    globPatterns: [],
    additionalPrecacheEntries: [{ url: "/offline", revision }],
}));
