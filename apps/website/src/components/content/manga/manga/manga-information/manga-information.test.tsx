import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { MangaInformation } from "./index";
import { MangaStatus, type MangaMetadata } from "@/types/content/manga";

const metadata: MangaMetadata = {
    storyBy: ["Tsugumi Ohba"],
    artBy: ["Takeshi Obata"],
    originalPublisher: "Shueisha",
    magazine: "Weekly Shonen Jump",
    serializationStartYear: "2003",
    serializationEndYear: "2006",
    demographic: "Shonen",
    genres: ["Drama", "Mystery"],
    status: MangaStatus.Completed,
    edition: "Complete Edition",
    editionPublisher: "Panini Comics (Planet Manga)",
    language: "Italian",
    volumes: 1,
    volumesOwned: 1,
    acquiredYear: "2026",
};

describe("MangaInformation", () => {
    it("renders a pill with its value for every piece of metadata", () => {
        render(<MangaInformation metadata={metadata} />);

        const expectedPills: [string, string][] = [
            ["Story by:", "Tsugumi Ohba"],
            ["Art by:", "Takeshi Obata"],
            ["Original publisher:", "Shueisha"],
            ["Magazine:", "Weekly Shonen Jump"],
            ["Serialization:", "2003 – 2006"],
            ["Demographic:", "Shonen"],
            ["Genres:", "Drama, Mystery"],
            ["Status:", "Completed"],
            ["Edition:", "Complete Edition"],
            ["Edition publisher:", "Panini Comics (Planet Manga)"],
            ["Language:", "Italian"],
            ["Volumes owned:", "1/1 ✓"],
            ["Acquired:", "2026"],
        ];

        expectedPills.forEach(([label, value]) => {
            expect(screen.getByText(label).parentElement).toHaveTextContent(value);
        });
    });

    it("joins several authors with a comma", () => {
        render(<MangaInformation metadata={{ ...metadata, storyBy: ["First Author", "Second Author"] }} />);

        expect(screen.getByText("Story by:").parentElement).toHaveTextContent("First Author, Second Author");
    });

    it("shows an ongoing serialization as running until present", () => {
        render(<MangaInformation metadata={{ ...metadata, serializationEndYear: undefined }} />);

        expect(screen.getByText("Serialization:").parentElement).toHaveTextContent("2003 – present");
    });
});
