import { FC } from "react";
import { mangas } from "@/lib/content/manga/manga";
import { MangaBrowser } from "@/components/content/manga/manga-browser";

/**
 * Reads the collection and hands it to the client-side browser. It exists so that
 * `src/content/manga/content.mdx` can place the browser without the MDX needing the data, the
 * browser being a client component that cannot read the filesystem itself.
 */
export const MangaCatalog: FC = () => <MangaBrowser mangas={mangas.list()} />;
