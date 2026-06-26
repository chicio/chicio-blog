import { FC } from "react";
import { Content } from "@/types/content/content";
import { PostsRowContainer } from "@/components/content/blog/posts-row-container";
import { PostCard } from "@/components/content/blog/post-card";

interface PostsRowProps {
    postsGroup: Content[];
}

export const PostsRow: FC<PostsRowProps> = ({ postsGroup }) => (
    <PostsRowContainer>
        <PostCard
            big={false}
            key={postsGroup[0].slug.formatted}
            slug={postsGroup[0].slug.formatted}
            title={postsGroup[0].frontmatter.title}
            image={postsGroup[0].frontmatter.image}
            authors={postsGroup[0].frontmatter.authors}
            date={postsGroup[0].frontmatter.date.formatted}
            readingTime={postsGroup[0].readingTime.text}
            description={postsGroup[0].frontmatter.description}
            tags={postsGroup[0].frontmatter.tags!}
        />
        {postsGroup[1] && (
            <PostCard
                big={false}
                key={postsGroup[1].slug.formatted}
                slug={postsGroup[1].slug.formatted}
                title={postsGroup[1].frontmatter.title}
                image={postsGroup[1].frontmatter.image}
                authors={postsGroup[1].frontmatter.authors}
                date={postsGroup[1].frontmatter.date.formatted}
                readingTime={postsGroup[1].readingTime.text}
                description={postsGroup[1].frontmatter.description!}
                tags={postsGroup[1].frontmatter!.tags!}
            />
        )}
    </PostsRowContainer>
);
