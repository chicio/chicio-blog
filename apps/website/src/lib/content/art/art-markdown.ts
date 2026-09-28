import { art, artGallery } from "@/lib/content/art/art";
import { contentBodyMarkdown } from "@/lib/mdx/content-body-markdown";
import { contentItemMarkdown } from "@/lib/mdx/content-item-markdown";

export const artMarkdown = contentItemMarkdown(art, (page) => {
    const body = contentBodyMarkdown(page);
    const images = artGallery()
        .map((image) => `![${image.caption}](${image.src})`)
        .join("\n\n");

    return body.length > 0 ? `${body}\n\n${images}\n` : `${images}\n`;
});
