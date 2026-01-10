import {FC} from "react";
import {tracking} from "@/types/configuration/tracking";
import {Content} from "@/types/content/content";
import {PostsRowContainer} from "@/components/sections/blog/components/posts-row-container";
import { PostCard } from "./post-card";

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
      trackingCategory={tracking.category.blog_home}
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
        trackingCategory={tracking.category.blog_home}
        tags={postsGroup[1].frontmatter!.tags!}
      />
    )}
  </PostsRowContainer>
);
