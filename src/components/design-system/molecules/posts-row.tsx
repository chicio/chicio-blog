import {FC} from "react";
import {tracking} from "@/types/tracking";
import {Post} from "@/types/post";
import {PostsRowContainer} from "@/components/design-system/website/posts-row-container";
import {PostCard} from "@/components/design-system/molecules/post-card";


interface PostsRowProps {
  postsGroup: Post[];
}

export const PostsRow: FC<PostsRowProps> = ({ postsGroup }) => (
  <PostsRowContainer>
    <PostCard
      big={false}
      key={postsGroup[0].frontmatter.slug.formatted}
      slug={postsGroup[0].frontmatter.slug.formatted}
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
        key={postsGroup[1].frontmatter.slug.formatted}
        slug={postsGroup[1].frontmatter.slug.formatted}
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
