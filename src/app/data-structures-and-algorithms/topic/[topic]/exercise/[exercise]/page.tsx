import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { createMetadata } from "@/lib/seo/seo";
import { NextDataStructuresAndAlgorithmsExerciseParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    getAllExercises,
    getExercise,
    getDataStructuresAndAlgorithmsTopic,
} from "@/lib/content/data-structures-and-algorithms";
import { Exercise } from "@/components/sections/data-structures-and-algorithms/components/exercise";

export async function generateMetadata({
    params,
}: NextDataStructuresAndAlgorithmsExerciseParameters): Promise<Metadata> {
    const receivedParameters = await params;
    const exercise = getExercise(receivedParameters);

    if (!exercise) {
        return {};
    }

    const { frontmatter } = exercise;

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        slug: exercise.slug.formatted,
        imageUrl: frontmatter.image,
        description: frontmatter.description,
        ogPageType: "article",
        keywords: frontmatter.tags,
    });
}

export async function generateStaticParams() {
    return getAllExercises().map((exercise) => exercise.slug.params);
}

export default async function DataStructureAndAlgorithmExercisePage({
    params,
}: NextDataStructuresAndAlgorithmsExerciseParameters) {
    const receivedParameters = await params;
    const exercise = getExercise(receivedParameters);

    if (!exercise) {
        notFound();
    }

    const topic = getDataStructuresAndAlgorithmsTopic({ topic: receivedParameters.topic });

    if (!topic) {
        notFound();
    }

    return <Exercise exercise={exercise} topic={topic} />;
}
