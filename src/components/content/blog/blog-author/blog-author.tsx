import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { ExternalLink } from "@/components/design-system/atoms/links/external-link";
import { BlogGenericPostListPageTemplate } from "@/components/content/blog/blog-generic-post-list-page-template";
import { Author } from "@/types/content/author";
import { Content } from "@/types/content/content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";
import { BiLogoLinkedin } from "react-icons/bi";

export interface BlogAuthorProps {
    author: Author;
    posts: Content[];
}

export const BlogAuthor: FC<BlogAuthorProps> = ({ author, posts }) => (
    <BlogGenericPostListPageTemplate
        title={`Posts published (${posts.length})`}
        posts={posts}
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_author}
        keywords={[author.name]}
        beforeContent={
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
                <ImageGlow
                    className="rounded-full"
                    alt={author.name}
                    src={author.image}
                    width={120}
                    height={120}
                    noPlaceholder={true}
                />
                <h2 className="mt-2! mb-0!">{author.name}</h2>
                {author.role && <p className="text-secondary-text mt-0!">{author.role}</p>}
                {author.bio && <p className="max-w-2xl">{author.bio}</p>}
                <ExternalLink
                    className="glow-container mt-2 inline-flex items-center gap-2 px-4 py-2 no-underline hover:no-underline"
                    href={author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BiLogoLinkedin size={20} />
                    <span>LinkedIn</span>
                </ExternalLink>
            </div>
        }
    />
);
