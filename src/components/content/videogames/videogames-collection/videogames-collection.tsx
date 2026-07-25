import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { consoles, games, getAllGamesForConsole } from "@/lib/content/videogames/videogames";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { ContentPage } from "@/components/features/content/content-page";
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { VideogamesViewSwitcher } from "@/components/content/videogames/videogames-view-switcher";

export const VideogamesCollection: React.FC = () => {
    const allConsoles = consoles.list();
    const gamesSortedByReleaseYear = games.list();
    const consolesWithGameCount = allConsoles.map((console) => ({
        console,
        gamesCount: getAllGamesForConsole(console.frontmatter.metadata?.name ?? "").length,
    }));

    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.videogames}>
            <PageTitle>My Videogames Collection</PageTitle>
            <p>
                My journey through Videogames that I started in 1992. From 8-bit consoles to modern powerhouses, each
                one tells a story of technological evolution and countless hours of gameplay. Videogames are{" "}
                <InternalLink to="/about-me">
                    one of the reason why I became a software engineer
                </InternalLink>
                .
            </p>
            <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard value={allConsoles.length} label="Consoles" />
                <StatCard value={gamesSortedByReleaseYear.length} label="Games" />
                <StatCard value={7} label="Generations" />
                <StatCard value={new Date().getFullYear() - 1992} label="Years" />
            </div>
            <VideogamesViewSwitcher consolesWithGameCount={consolesWithGameCount} games={gamesSortedByReleaseYear} />
            <JsonLd
                type="Website"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
            />
        </ContentPage>
    );
};
