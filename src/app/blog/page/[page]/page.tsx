import {getPostsPaginationFor} from "@/lib/posts";
import Link from "next/link";
import {NextPostPaginationParameters} from "@/types/post";

// export async function generateStaticParams(): Promise<PostPaginationParameters[]> {
//     return generateAllPostPaginationPages()
// }

export default async function BlogPage({ params }: NextPostPaginationParameters) {
    const { page } = await params
    const pageParam = parseInt(page || "1", 10);
    const {paginatedPosts, previousPageUrl, nextPageUrl} = getPostsPaginationFor(pageParam);

    return (
        <main>
            <h1>Blog</h1>
            <ul>
                {paginatedPosts.map((post) => (
                    <li key={post.slug}>
                        <Link href={post.slug}>
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <div>
                {previousPageUrl && <a href={previousPageUrl}>Previous</a>}
                {nextPageUrl && <a href={nextPageUrl}>Next</a>}
            </div>
        </main>
    );
}
