import {getAllPosts, getPostBySlug} from "@/lib/posts";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const { metadata, content } = getPostBySlug(slug);

    return (
        <article>
            <h1>{metadata.title}</h1>
            <p>{metadata.date}</p>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
    );
}
