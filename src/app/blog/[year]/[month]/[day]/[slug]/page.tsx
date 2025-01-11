import {getPostBy} from "@/lib/posts";

export default async function BlogPost({ params }: { params: { year: string, month: string, day: string, slug: string } }) {
    const { year, month, day, slug } = await params;
    const { frontmatter, content, readingTime } = getPostBy(year, month, day, slug);

    return (
        <article>
            <h1>{frontmatter.title}</h1>
            <h2>{frontmatter.authors[0].name}</h2>
            <h2>{frontmatter.date.toString()}</h2>
            <h2>{readingTime.text}</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <div>{frontmatter.tags}</div>
        </article>
    );
}
