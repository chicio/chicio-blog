import { NavigationButtons } from "chicio-blog";

// NavigationButtons renders two absolutely-positioned chevrons, so every cell gives it the
// `relative` framed stage it gets inside ImageCarousel / FullscreenModal. The stage stands in for the
// carousel photo, whose real source (/media/content/videogames/...) the preview host does not serve.
const photo = (caption: string, hue: number) =>
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">` +
            `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="hsl(${hue},42%,17%)"/>` +
            `<stop offset="100%" stop-color="hsl(${hue},55%,5%)"/>` +
            `</linearGradient></defs>` +
            `<rect width="1200" height="700" fill="url(#g)"/>` +
            `<text x="600" y="360" text-anchor="middle" font-family="Courier New, monospace" font-size="48" fill="#39FF14">${caption}</text>` +
            `</svg>`,
    );

const noop = () => {};

export const Default = () => (
    <div className="glow-container bg-general-background-light relative flex h-[350px] w-full items-center justify-center">
        <span className="text-secondary-text font-mono text-sm">Image 2 of 7</span>
        <NavigationButtons onPrevious={noop} onNext={noop} />
    </div>
);

export const OverCarouselPhoto = () => (
    <div className="glow-container relative h-[350px] w-full overflow-hidden">
        <img
            src={photo("Nintendo Switch OLED", 150)}
            alt="Nintendo Switch OLED"
            className="h-full w-full object-cover"
        />
        <NavigationButtons onPrevious={noop} onNext={noop} stopPropagation />
    </div>
);
