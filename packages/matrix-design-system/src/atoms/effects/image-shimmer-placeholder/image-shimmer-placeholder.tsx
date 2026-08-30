import type { ImagePlaceholder } from "../plain-image";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#001100" offset="20%" />
      <stop stop-color="#002200" offset="50%" />
      <stop stop-color="#001100" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#001100" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

/**
 * `btoa` is a global in browsers and in Node since v16, so the design system needs no Node types
 * and no environment branch. The shimmer SVG is ASCII, which is all latin1-only `btoa` accepts.
 */
const toBase64 = (str: string) => btoa(str);

export const imageShimmerPlaceholder: ImagePlaceholder = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;
