import {generateAllPostParams, getPostBy} from "@/lib/posts";
import {NextPostParameters, PostParameters} from "@/types/post";

export async function generateStaticParams(): Promise<PostParameters[]> {
    return generateAllPostParams();
}

export default async function BlogPost({ params }: NextPostParameters) {
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
