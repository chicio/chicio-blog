export enum MangaStatus {
    Completed = "Completed",
    Ongoing = "Ongoing",
}

export type MangaMetadata = {
    storyBy: string[];
    artBy: string[];
    originalPublisher: string;
    magazine: string;
    serializationStartYear: string;
    serializationEndYear?: string;
    demographic: string;
    genres: string[];
    status: MangaStatus;
    edition: string;
    editionPublisher: string;
    language: string;
    volumes: number;
    volumesOwned: number;
    acquiredYear: string;
};
