import { createMetadata } from "@/lib/seo/seo";
import { NextVideogamesGameParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGames, getGame } from "@/lib/content/videogames";
import { Game } from "@/components/sections/videogames/components/game";

export async function generateMetadata({
  params,
}: NextVideogamesGameParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const game = getGame(receivedParameters)!;

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
    ogPageType: "website", //TODO: review og page type
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  console.log("generateStaticParams for game page");
  return getAllGames().map(
    (game) => game.slug.params,
  );
}

export default async function VideogamesGamePage({
  params,
}: NextVideogamesGameParameters) {
  const receivedParameters = await params;
  const game =
    getGame(receivedParameters);

  if (!game) {
    notFound();
  }

  return (
    <Game game={game!} console={receivedParameters.console} />
  );
}
