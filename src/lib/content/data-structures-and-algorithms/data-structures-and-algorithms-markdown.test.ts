import { describe, it, expect, vi } from "vitest";

const {
    mockListTopics,
    mockListExercises,
    mockSingleRoadmap,
    mockSingleTopic,
    mockGetAllExercisesForTopic,
    mockSingleExercise,
    mockSingleExercisesList,
} = vi.hoisted(() => ({
    mockListTopics: vi.fn(),
    mockListExercises: vi.fn(),
    mockSingleRoadmap: vi.fn(),
    mockSingleTopic: vi.fn(),
    mockGetAllExercisesForTopic: vi.fn(),
    mockSingleExercise: vi.fn(),
    mockSingleExercisesList: vi.fn(),
}));

vi.mock("@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms", () => ({
    topics: { list: mockListTopics, single: mockSingleTopic },
    exercises: { list: mockListExercises, single: mockSingleExercise },
    dsaRoadmap: { single: mockSingleRoadmap },
    dsaExercisesList: { single: mockSingleExercisesList },
    getAllExercisesForTopic: mockGetAllExercisesForTopic,
}));

import {
    dsaExerciseMarkdown,
    dsaExercisesListMarkdown,
    dsaMarkdown,
    dsaRoadmapMarkdown,
    dsaTopicMarkdown,
} from "./data-structures-and-algorithms-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

const topic = {
    frontmatter: { title: "Graph", description: "Graph algorithms", tags: ["dsa", "graph"] },
    slug: { formatted: `${slugs.dataStructuresAndAlgorithms.home}/topic/graph` },
    content: "Graph body.",
};

const exercise = {
    frontmatter: {
        title: "Word Ladder",
        description: "BFS exercise",
        tags: ["dsa", "graph"],
        metadata: { difficulty: "Hard", technique: "BFS", leetcodeUrl: "https://leetcode.com/word-ladder" },
    },
    slug: { formatted: `${slugs.dataStructuresAndAlgorithms.home}/topic/graph/exercise/word-ladder` },
    content: "Exercise body.",
};

describe("data-structures-and-algorithms-markdown", () => {
    describe("dsaMarkdown", () => {
        it("renders the canonical header with a Topics section", () => {
            mockListTopics.mockReturnValue([topic]);

            const result = dsaMarkdown();

            expect(result).toContain(`# Data Structures & Algorithms — ${siteMetadata.title}`);
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}${slugs.dataStructuresAndAlgorithms.home}`);
            expect(result).toContain("## Topics");
            expect(result).toContain("[Graph]");
        });
    });

    describe("dsaRoadmapMarkdown", () => {
        it("renders the canonical header from the roadmap frontmatter", () => {
            mockSingleRoadmap.mockReturnValue({
                frontmatter: { title: "Roadmap", description: "Course roadmap" },
                content: "Roadmap body.",
            });

            const result = dsaRoadmapMarkdown();

            expect(result).toContain("# Roadmap");
            expect(result).toContain("> Course roadmap");
            expect(result).toContain("Roadmap body.");
        });
    });

    describe("dsaExercisesListMarkdown", () => {
        it("renders the canonical header with an exercises section", () => {
            mockSingleExercisesList.mockReturnValue({
                frontmatter: { title: "Exercises", description: "All exercises" },
            });
            mockListExercises.mockReturnValue([exercise]);

            const result = dsaExercisesListMarkdown();

            expect(result).toContain("# Exercises");
            expect(result).toContain("## All Exercises (1)");
            expect(result).toContain("[Word Ladder]");
        });
    });

    describe("dsaTopicMarkdown", () => {
        it("returns null for an unknown topic", () => {
            mockSingleTopic.mockReturnValue(undefined);

            expect(dsaTopicMarkdown({ topic: "unknown" })).toBeNull();
        });

        it("folds tags into the body and lists exercises for the topic", () => {
            mockSingleTopic.mockReturnValue(topic);
            mockGetAllExercisesForTopic.mockReturnValue([exercise]);

            const result = dsaTopicMarkdown({ topic: "graph" });

            expect(result).toContain("# Graph");
            expect(result).toContain("**Tags:** dsa, graph");
            expect(result).toContain("Graph body.");
            expect(result).toContain("## Exercises");
            expect(result).toContain("[Word Ladder]");
        });
    });

    describe("dsaExerciseMarkdown", () => {
        it("returns null for an unknown exercise", () => {
            mockSingleExercise.mockReturnValue(undefined);

            expect(dsaExerciseMarkdown({ topic: "graph", exercise: "unknown" })).toBeNull();
        });

        it("folds difficulty/technique/tags/leetcode into the body", () => {
            mockSingleExercise.mockReturnValue(exercise);

            const result = dsaExerciseMarkdown({ topic: "graph", exercise: "word-ladder" });

            expect(result).toContain("# Word Ladder");
            expect(result).toContain("**Difficulty:** Hard");
            expect(result).toContain("**Technique:** BFS");
            expect(result).toContain("**Tags:** dsa, graph");
            expect(result).toContain("**LeetCode:** https://leetcode.com/word-ladder");
            expect(result).toContain("Exercise body.");
        });
    });
});
