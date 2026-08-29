import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { createMetadata } from "@/lib/seo/seo";
import { NextDataStructuresAndAlgorithmsParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics } from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { siblingsOf } from "@/lib/content/siblings";
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
  const topic = topics.single(receivedParameters);

  if (!topic) {
    notFound();
  }

  const siblings = siblingsOf(topics.list(), topic.slug.formatted);

  return (
    <Topic topic={topic} previous={siblings?.previous} next={siblings?.next} />
  );
}
