import { describe, it, expect } from "vitest";
import { Content } from "@/types/content/content";
import { Frontmatter } from "@/types/content/frontmatter";
import { MangaMetadata, MangaStatus } from "@/types/content/manga";
import {
    carouselImages,
    collectionFigures,
    isMangaComplete,
    serializationLabel,
    volumesOwnedLabel,
} from "./manga-figures";

const metadataOf = (overrides: Partial<MangaMetadata> = {}): MangaMetadata => ({
    storyBy: ["Koyoharu Gotouge"],
    artBy: ["Koyoharu Gotouge"],
    originalPublisher: "Shueisha",
    magazine: "Weekly Shonen Jump",
    serializationStartYear: "2016",
    serializationEndYear: "2020",
    demographic: "Shonen",
    genres: ["Action"],
    status: MangaStatus.Completed,
    edition: "Standard Edition",
    editionPublisher: "Star Comics",
    language: "Italian",
    volumes: 23,
    volumesOwned: 23,
    acquiredYear: "2026",
    gallery: [],
    ...overrides,
});

const mangaOf = (metadata?: MangaMetadata): Content<MangaMetadata> =>
    ({ frontmatter: { title: "Any", metadata } }) as Content<MangaMetadata>;

describe("manga figures", () => {
    describe("isMangaComplete", () => {
        it("is complete when every Volume of the edition is owned", () => {
            expect(isMangaComplete(metadataOf({ volumes: 23, volumesOwned: 23 }))).toBe(true);
        });

        it("is not complete while a Volume is missing", () => {
            expect(isMangaComplete(metadataOf({ volumes: 23, volumesOwned: 22 }))).toBe(false);
        });
    });

    describe("volumesOwnedLabel", () => {
        it("adds a check mark once the Manga is complete", () => {
            expect(volumesOwnedLabel(metadataOf({ volumes: 1, volumesOwned: 1 }))).toBe("1/1 ✓");
        });

        it("shows only owned over total while incomplete", () => {
            expect(volumesOwnedLabel(metadataOf({ volumes: 23, volumesOwned: 5 }))).toBe("5/23");
        });
    });

    describe("serializationLabel", () => {
        it("spans start to end year for a finished serialization", () => {
            expect(serializationLabel(metadataOf())).toBe("2016 – 2020");
        });

        it("ends in present while the serialization is ongoing", () => {
            expect(serializationLabel(metadataOf({ serializationEndYear: undefined }))).toBe("2016 – present");
        });
    });

    describe("carouselImages", () => {
        it("shows exactly the shelf photos, without the cover, once there are some", () => {
            const frontmatter = {
                image: "/cover.jpg",
                metadata: metadataOf({ gallery: ["/shelf-1.jpg", "/shelf-2.jpg"] }),
            };

            expect(carouselImages(frontmatter as Frontmatter<MangaMetadata>)).toEqual(["/shelf-1.jpg", "/shelf-2.jpg"]);
        });

        it("falls back to the cover while the gallery is empty", () => {
            const frontmatter = { image: "/cover.jpg", metadata: metadataOf({ gallery: [] }) };

            expect(carouselImages(frontmatter as Frontmatter<MangaMetadata>)).toEqual(["/cover.jpg"]);
        });

        it("falls back to the cover when the Manga has no metadata", () => {
            expect(carouselImages({ image: "/cover.jpg" } as Frontmatter<MangaMetadata>)).toEqual(["/cover.jpg"]);
        });
    });

    describe("collectionFigures", () => {
        it("counts Manga, owned Volumes, complete Manga and distinct authors", () => {
            const demonSlayer = mangaOf(metadataOf());
            const deathNote = mangaOf(
                metadataOf({ storyBy: ["Tsugumi Ohba"], artBy: ["Takeshi Obata"], volumes: 12, volumesOwned: 1 }),
            );

            expect(collectionFigures([demonSlayer, deathNote])).toEqual({
                manga: 2,
                volumes: 24,
                complete: 1,
                authors: 3,
            });
        });

        it("ignores entries without metadata when summing Volumes and authors", () => {
            expect(collectionFigures([mangaOf(undefined)])).toEqual({ manga: 1, volumes: 0, complete: 0, authors: 0 });
        });
    });
});
