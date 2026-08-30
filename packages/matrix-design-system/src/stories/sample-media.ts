/**
 * Placeholder imagery for stories, as inline SVG data URIs.
 *
 * The previews these stories came from imported real photographs out of the website's content
 * folder. The design system cannot reach for those: it is published on its own, and a package that
 * needs the site's files to render its own documentation is not self-contained. Data URIs keep the
 * stories dependency-free and working offline, and nothing here is a design decision — the
 * components under test only care that they were handed an image of a given aspect ratio.
 */

const svg = (width: number, height: number, label: string) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
            `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="#012b12"/><stop offset="100%" stop-color="#001100"/>` +
            `</linearGradient></defs>` +
            `<rect width="${width}" height="${height}" fill="url(#g)"/>` +
            `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#31d353" stroke-opacity="0.5"/>` +
            `<text x="50%" y="50%" fill="#31d353" font-family="monospace" font-size="${Math.round(Math.min(width, height) / 10)}" ` +
            `text-anchor="middle" dominant-baseline="middle">${label}</text>` +
            `</svg>`,
    );

export const landscapeImage = svg(1200, 800, "landscape");
export const portraitImage = svg(800, 1200, "portrait");
export const squarePortrait = svg(400, 400, "portrait");
