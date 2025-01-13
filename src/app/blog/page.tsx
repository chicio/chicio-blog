import BlogPage from '@/app/blog/page/[page]/page';
import {createMetadata} from "@/lib/seo";
import {siteMetadata} from "@/types/site-metadata";
import {slugs} from "@/types/slug";

export const metadata = createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.blog}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: 'website',
})

export default async function BlogHome() {
    const params = Promise.resolve({ page: '1' });
    return <BlogPage params={params} />;
}
