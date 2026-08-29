import { FC } from "react";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { consoles, games } from "@/lib/content/videogames/videogames";

const collectionStartYear = 1992;
const consoleGenerations = 7;

/**
 * The collection's headline numbers. Counted from the content rather than written down, so they cannot
 * fall behind the collection. Placed by `src/content/videogames/content.mdx`.
 */
export const VideogamesStats: FC = () => (
    <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={consoles.list().length} label="Consoles" />
        <StatCard value={games.list().length} label="Games" />
        <StatCard value={consoleGenerations} label="Generations" />
        <StatCard value={new Date().getFullYear() - collectionStartYear} label="Years" />
    </div>
);
