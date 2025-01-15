import {siteMetadata} from "@/types/site-metadata";
import {BlogGenericPostListPageTemplate} from "@/components/templates/blog-generic-post-list-page-template";
import {tracking} from "@/types/tracking";
import {getAllPosts} from "@/lib/posts";

export default async function BlogArchive() {
  const author = siteMetadata.author;
  const posts = getAllPosts();

  return (
      <BlogGenericPostListPageTemplate
          title={"Archive"}
          posts={posts}
          author={author}
          trackingCategory={tracking.category.blog_archive}
      />
  );
}

