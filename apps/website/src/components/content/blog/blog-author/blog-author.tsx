import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ProfileHero } from "@/components/design-system/organism/profile-hero";
import { Chip } from "@/components/design-system/atoms/chip";
import { ContentPage } from "@/components/features/content/content-page";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { PostsRow } from "@/components/content/blog/posts-row";
import { AuthorSocials } from "./author-socials";
import { groupArrayBy } from "@/lib/content/posts/posts";
import { Author } from "@/types/content/author";
import { Content } from "@/types/content/content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export interface BlogAuthorProps {
    author: Author;
    posts: Content[];
}

export const BlogAuthor: FC<BlogAuthorProps> = ({ author, posts }) => {
    const postsGrouped = groupArrayBy(posts, 2);

    return (
        <>
            <ContentPage
                author={siteMetadata.author}
                trackingCategory={tracking.category.blog_author}
            >
                <ProfileHero
                    name={author.name}
                    role={author.role}
                    imageSrc={author.imageLarge}
                    imageAlt={author.name}
                >
                    {author.bio && <p className="mx-auto mt-4 max-w-2xl text-center">{author.bio}</p>}
                    <AuthorSocials author={author} />
                    <div className="mt-4 flex justify-center">
                        <Chip>{`${posts.length} ${posts.length === 1 ? "post" : "posts"} published`}</Chip>
                    </div>
                </ProfileHero>
                <PageTitle>{`Posts published (${posts.length})`}</PageTitle>
                {postsGrouped.map((postsGroup, index) => (
                    <PostsRow
                        postsGroup={postsGroup}
                        key={`PostCardsRow${index}`}
                    />
                ))}
            </ContentPage>
            <JsonLd
                type="Blog"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
                keywords={[author.name]}
            />
        </>
    );
};
