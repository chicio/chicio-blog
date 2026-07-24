import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { createMetadata } from "@/lib/seo/seo";
import { NextDataStructuresAndAlgorithmsParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  topics,
  getDataStructuresAndAlgorithmsTopicWithNavigation,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { Topic } from "@/components/content/data-structures-and-algorithms/topic";

export async function generateMetadata({
  params,
}: NextDataStructuresAndAlgorithmsParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const topic = topics.single(receivedParameters)!;

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
  return topics.list().map(
    (topic) => topic.slug.params,
  );
}

export default async function DataStructureAndAlgorithmTopicPage({
  params,
}: NextDataStructuresAndAlgorithmsParameters) {
  const receivedParameters = await params;
  const topicNavigation =
    getDataStructuresAndAlgorithmsTopicWithNavigation(receivedParameters);

  if (!topicNavigation) {
    notFound();
  }

  const { topic, previousTopic, nextTopic } = topicNavigation;

  return (
    <Topic topic={topic} previousTopic={previousTopic} nextTopic={nextTopic} />
  );
}
