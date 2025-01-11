import Link from "next/link";
import {getAllPosts} from "@/lib/posts";

const POSTS_PER_PAGE = 5;

export default async function BlogHome({ searchParams }: { searchParams: { page?: string } }) {
    const { page } = searchParams
    const pageParam = parseInt(page || "1", 10);
    const posts = getAllPosts();
    const start = (pageParam - 1) * POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

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
                {pageParam > 1 && <Link href={`/?page=${pageParam - 1}`}>Previous</Link>}
                {pageParam < totalPages && <Link href={`/?page=${pageParam + 1}`}>Next</Link>}
            </div>
        </main>
    );
}
