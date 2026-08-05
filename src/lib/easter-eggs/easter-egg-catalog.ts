import { tracking } from "@/types/configuration/tracking";

export type EasterEggSlug =
    | "the-white-rabbit"
    | "deja-vu"
    | "i-know-kung-fu"
    | "there-is-no-spoon"
    | "the-one"
    | "dodge-this";

export interface EasterEggCatalogEntry {
    slug: EasterEggSlug;
    title: string;
    videoSrc: string;
    poster: string;
    captions: string;
    trackingAction: string;
}

export const EASTER_EGG_SLUGS: readonly EasterEggSlug[] = [
    "the-white-rabbit",
    "deja-vu",
    "i-know-kung-fu",
    "there-is-no-spoon",
    "the-one",
    "dodge-this",
];

const videoPath = (slug: EasterEggSlug) => `/media/video/${slug}.mp4`;
const posterPath = (slug: EasterEggSlug) => `/media/video/${slug}-poster.jpg`;
const captionsPath = (slug: EasterEggSlug) => `/media/video/${slug}.vtt`;

const catalogEntry = (slug: EasterEggSlug, title: string, trackingAction: string): EasterEggCatalogEntry => ({
    slug,
    title,
    videoSrc: videoPath(slug),
    poster: posterPath(slug),
    captions: captionsPath(slug),
    trackingAction,
});

export const EASTER_EGG_CATALOG: Record<EasterEggSlug, EasterEggCatalogEntry> = {
    "the-white-rabbit": catalogEntry("the-white-rabbit", "The White Rabbit", tracking.action.easter_egg_white_rabbit),
    "deja-vu": catalogEntry("deja-vu", "Déjà Vu", tracking.action.easter_egg_deja_vu),
    "i-know-kung-fu": catalogEntry("i-know-kung-fu", "I Know Kung Fu", tracking.action.easter_egg_kung_fu),
    "there-is-no-spoon": catalogEntry("there-is-no-spoon", "There Is No Spoon", tracking.action.easter_egg_spoon),
    "the-one": catalogEntry("the-one", "The One", tracking.action.easter_egg_the_one),
    "dodge-this": catalogEntry("dodge-this", "Dodge This", tracking.action.easter_egg_dodge_this),
};

export const isEasterEggSlug = (value: unknown): value is EasterEggSlug =>
    typeof value === "string" && (EASTER_EGG_SLUGS as readonly string[]).includes(value);
