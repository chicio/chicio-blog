import { FullscreenModal } from "chicio-blog";

// FullscreenModal is an overlay: it renders `fixed inset-0` and always mounts open, so each cell is
// captured on its own page and fills the whole card. The gallery it drives on the real site lives
// under /media/content/videogames/... — those files are not served by the preview host, so the same
// shots are inlined here as data-URI SVGs and the modal renders with real images instead of broken
// ones. Alt text and captions match the real Nintendo Switch OLED gallery.
const photo = (caption: string, hue: number) =>
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
            `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="hsl(${hue},42%,17%)"/>` +
            `<stop offset="100%" stop-color="hsl(${hue},55%,5%)"/>` +
            `</linearGradient></defs>` +
            `<rect width="1200" height="800" fill="url(#g)"/>` +
            `<rect x="48" y="48" width="1104" height="704" fill="none" stroke="#39FF14" stroke-opacity="0.3" stroke-width="4"/>` +
            `<text x="600" y="380" text-anchor="middle" font-family="Courier New, monospace" font-size="62" fill="#E8FFE8">Nintendo Switch OLED</text>` +
            `<text x="600" y="452" text-anchor="middle" font-family="Courier New, monospace" font-size="34" fill="#39FF14">${caption}</text>` +
            `</svg>`,
    );

const gallery = [
    photo("gallery / 1.jpeg", 140),
    photo("gallery / 2.jpeg", 190),
    photo("gallery / 3.jpeg", 100),
    photo("gallery / 4.jpeg", 160),
];

const noop = () => {};

// Every cell sits on an explicitly sized stage. The card mounts each story into a root carrying
// `transform: translateZ(0)`, which makes that root — not the viewport — the containing block for
// `position: fixed`. That root is zero-height on its own, so an unstaged modal collapses to a 32px
// strip. Giving the stage a real height hands the overlay a viewport-shaped box to fill.
export const Default = () => (
    <div className="h-[520px] w-full">
        <FullscreenModal images={gallery} currentIndex={0} onClose={noop} alt="Nintendo Switch OLED" />
    </div>
);

export const MidGallery = () => (
    <div className="h-[520px] w-full">
        <FullscreenModal
            images={gallery}
            currentIndex={2}
            onClose={noop}
            onNavigate={noop}
            alt="Nintendo Switch OLED"
        />
    </div>
);

export const SingleImage = () => (
    <div className="h-[520px] w-full">
        <FullscreenModal images={[gallery[0]]} currentIndex={0} onClose={noop} alt="Nintendo Switch OLED" />
    </div>
);
