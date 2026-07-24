import { Content } from "@/types/content/content";
import { getAllContentFor, getSingleContentBy } from "./content";

type Comparator<TMeta> = (a: Content<TMeta>, b: Content<TMeta>) => number;

export const createSection = <TMeta = unknown>(config: { slug: string; sort?: Comparator<TMeta> }) => ({
    list: (): Content<TMeta>[] => {
        const all = [...getAllContentFor<TMeta>(config.slug)];
        return config.sort ? all.sort(config.sort) : all;
    },
    single: (params?: Record<string, string>): Content<TMeta> | undefined =>
        getSingleContentBy<TMeta>(config.slug, params),
});
