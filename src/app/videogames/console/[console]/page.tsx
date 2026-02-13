import { createMetadata } from "@/lib/seo/seo";
import { NextVideogamesConsoleParameters, NextVideogamesGameParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllConsoles, getAllGames, getConsole, getGame } from "@/lib/content/videogames";
import { Console } from "@/components/sections/videogames/components/console";

export async function generateMetadata({
  params,
}: NextVideogamesConsoleParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const console = getConsole(receivedParameters)!;

  if (!console) {
    return {};
  }

  const { frontmatter } = console;

  return createMetadata({
    author: siteMetadata.author,
    title: frontmatter.title,
    slug: console.slug.formatted,
    imageUrl: frontmatter.image,
    description: frontmatter.description,
    ogPageType: "website", //TODO: review og page type
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  return getAllConsoles().map(
    (console) => console.slug.params,
  );
}

export default async function VideogamesGamesForConsolePage({
  params,
}: NextVideogamesConsoleParameters) {
  const receivedParameters = await params;
  const console =
    getConsole(receivedParameters);

  if (!console) {
    notFound();
  }

  return (
    <Console console={console} consoleSlug={receivedParameters.console} />
  );
}
