import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { createMetadata } from "@/lib/seo/seo";
import { NextDataStructuresAndAlgorithmsParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllDataStructuresAndAlgorithmsTopics,
  getDataStructuresAndAlgorithmsTopic,
  getDataStructuresAndAlgorithmsTopicWithNavigation,
} from "@/lib/content/data-structures-and-algorithms";
import { Topic } from "@/components/sections/data-structures-and-algorithms/components/topic";

export async function generateMetadata({
  params,
}: NextDataStructuresAndAlgorithmsParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const topic = getDataStructuresAndAlgorithmsTopic(receivedParameters)!;

  if (!topic) {
    return {};
  }

  const { frontmatter } = topic;

  return createMetadata({
    author: siteMetadata.author,
    title: frontmatter.title,
    slug: topic.slug.formatted,
    imageUrl: frontmatter.image,
    description: frontmatter.description,
    ogPageType: "article",
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  return getAllDataStructuresAndAlgorithmsTopics().map(
    (topic) => topic.slug.params,
  );
}

export default async function DataStructureAndAlgorithmTopicPage({
  params,
}: NextDataStructuresAndAlgorithmsParameters) {
  const receivedParameters = await params;
  const topics =
    getDataStructuresAndAlgorithmsTopicWithNavigation(receivedParameters);

  if (!topics) {
    notFound();
  }

  const { topic, previousTopic, nextTopic } = topics;

  return (
    <Topic topic={topic} previousTopic={previousTopic} nextTopic={nextTopic} />
  );
}
