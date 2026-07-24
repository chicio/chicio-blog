import { createMetadata } from "@/lib/seo/seo";
import { NextVideogamesGameParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { consoles, games } from "@/lib/content/videogames/videogames";
import { Game } from "@/components/content/videogames/game";

export async function generateMetadata({
  params,
}: NextVideogamesGameParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const game = games.single(receivedParameters)!;

  if (!game) {
    return {};
  }

  const { frontmatter } = game;

  return createMetadata({
    author: siteMetadata.author,
    title: frontmatter.title,
    slug: game.slug.formatted,
    imageUrl: frontmatter.image,
    description: frontmatter.description,
    ogPageType: "website",
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  return games.list().map((game) => game.slug.params);
}

export default async function VideogamesGamePage({
  params,
}: NextVideogamesGameParameters) {
  const receivedParameters = await params;
  const game = games.single(receivedParameters);
  const console = consoles.single(receivedParameters);

  if (!game || !console) {
    notFound();
  }

  return <Game game={game!} console={console} />;
}
