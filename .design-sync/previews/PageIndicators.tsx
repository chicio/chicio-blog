import { PageIndicators } from "chicio-blog";

// PageIndicators pins itself to `absolute bottom-4 left-1/2`, so every cell supplies the `relative`
// carousel stage it lives inside. Only the length of `images` is read, so the real gallery paths from
// the Nintendo Switch OLED entry are passed verbatim.
const switchGallery = [
    "/media/content/videogames/console/nintendo-switch/gallery/1.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/2.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/3.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/4.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/5.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/6.jpeg",
    "/media/content/videogames/console/nintendo-switch/gallery/7.jpeg",
];

const noop = () => {};

export const Default = () => (
    <div className="glow-container bg-general-background-light relative h-[240px] w-full">
        <PageIndicators images={switchGallery} currentIndex={0} onSelect={noop} />
    </div>
);

export const Glassmorphism = () => (
    <div className="glow-container bg-general-background-light relative h-[240px] w-full">
        <PageIndicators images={switchGallery} currentIndex={3} onSelect={noop} glassmorphism />
    </div>
);

export const TwoImages = () => (
    <div className="glow-container bg-general-background-light relative h-[240px] w-full">
        <PageIndicators images={switchGallery.slice(0, 2)} currentIndex={1} onSelect={noop} />
    </div>
);
