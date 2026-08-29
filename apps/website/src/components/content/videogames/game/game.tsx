import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { Content } from "@/types/content/content";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { ImageCarousel } from "@/components/features/design-system-next/image-carousel";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ConsoleLogos } from "@/components/content/videogames/console-logos";
import { GameFormatIcon } from "@/components/content/videogames/game-format-icon";
import { VideogameNavigation } from "@/components/content/videogames/videogame-navigation";
import { GameBreadcrumb } from "./game-breadcrumb";
import { GameInformation } from "./game-information";

interface GameProps {
    game: Content<GameMetadata>;
    console: Content<ConsoleMetadata>;
    previous?: Content<GameMetadata>;
    next?: Content<GameMetadata>;
}

export const Game: FC<PropsWithChildren<GameProps>> = async ({ game, console, previous, next }) => {
    const { contentFileRelativePath: contentPath } = game;
    const { default: GameContent } = await import(`@/content/${contentPath}/content.mdx`);

    return (
        <ReadingContentPage
            author={siteMetadata.author}
            beforeContent={
                <GameBreadcrumb
                    gameTitle={game.frontmatter.title}
                    gameSlug={game.slug.formatted}
                    consoleName={console.frontmatter.metadata!.name}
                    consoleSlug={console.slug.formatted}
                />
            }
        >
            <PageTitle>{game.frontmatter.title}</PageTitle>
            <div className="flex flex-row gap-2">
                <ConsoleLogos
                    manufacturer={console.frontmatter.metadata!.manufacturer}
                    manufacturerLogo={console.frontmatter.metadata!.manufacturerLogo}
                    logo={console.frontmatter.metadata!.logo}
                    url={console.slug.formatted}
                />
                {game.frontmatter.metadata?.formats.map((format) => (
                    <span
                        key={format}
                        className="glow-container bg-general-background h-14 text-primary px-2 py-2 font-mono text-base flex flex-col justify-center items-center text-shadow-sm"
                    >
                        <GameFormatIcon format={format} />
                        <span>{format}</span>
                    </span>
                ))}
            </div>
            <ImageCarousel
                images={game.frontmatter.metadata?.gallery || [game.frontmatter.image]}
                alt={game.frontmatter.title}
                className="mb-6"
            />
            <GameInformation
                releaseYear={game.frontmatter.metadata?.releaseYear}
                acquiredYear={game.frontmatter.metadata?.acquiredYear}
                developer={game.frontmatter.metadata?.developer}
                publisher={game.frontmatter.metadata?.publisher}
                genre={game.frontmatter.metadata?.genre}
                pegiRating={game.frontmatter.metadata?.pegiRating}
                region={game.frontmatter.metadata?.region}
                console={game.frontmatter.metadata?.console}
                className="mb-6"
            />
            <GameContent />
            <VideogameNavigation
                previous={previous ? { url: previous.slug.formatted, title: previous.frontmatter.title } : undefined}
                next={next ? { url: next.slug.formatted, title: next.frontmatter.title } : undefined}
            />
            <JsonLd
                type="Website"
                url={`${siteMetadata.siteUrl}${game.slug.formatted}`}
                imageUrl={game.frontmatter.image}
                title={game.frontmatter.title}
                description={game.frontmatter.description}
                keywords={game.frontmatter.tags}
            />
        </ReadingContentPage>
    );
};
