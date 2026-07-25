import { FC } from "react";
import { consoles, games, getAllGamesForConsole } from "@/lib/content/videogames/videogames";
import { VideogamesViewSwitcher } from "@/components/content/videogames/videogames-view-switcher";

/**
 * Reads the collection and hands it to the client-side view switcher. It exists so that
 * `src/content/videogames/content.mdx` can place the browser without the MDX needing the data, the
 * switcher being a client component that cannot read the filesystem itself.
 */
export const VideogamesCatalog: FC = () => {
    const allConsoles = consoles.list();
    const consolesWithGameCount = allConsoles.map((console) => ({
        console,
        gamesCount: getAllGamesForConsole(console.frontmatter.metadata?.name ?? "").length,
    }));

    return <VideogamesViewSwitcher consolesWithGameCount={consolesWithGameCount} games={games.list()} />;
};
