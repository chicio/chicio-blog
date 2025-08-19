import {siteMetadata} from "@/types/site-metadata";
import {tracking} from "@/types/tracking";
import {getPosts} from "@/lib/posts/posts";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { BlogGenericPostListPageTemplate } from "@/components/design-system/templates/blog-generic-post-list-page-template";

export default async function BlogArchive() {
  const author = siteMetadata.author;
  const posts = getPosts();

  return (
      <>
      <BlogGenericPostListPageTemplate
          title={"Archive"}
          posts={posts}
          author={author}
          trackingCategory={tracking.category.blog_archive}
      />
      <JsonLd ogPageType="website" url={siteMetadata.siteUrl} imageUrl={siteMetadata.featuredImage} title={siteMetadata.title}/>
      </>
  );
}

