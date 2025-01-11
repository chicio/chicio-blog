import Link from "next/link";
import {getAllPosts} from "@/lib/posts";

const POSTS_PER_PAGE = 5;

export default function BlogHome({ searchParams }: { searchParams: { page?: string } }) {
    const page = parseInt(searchParams.page || "1", 10);
    const posts = getAllPosts();
    const start = (page - 1) * POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    return (
        <main>
            <h1>Blog</h1>
            <ul>
                {paginatedPosts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>
                            <h2>{post.title}</h2>
                            <p>{post.excerpt}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <div>
                {page > 1 && <Link href={`/?page=${page - 1}`}>Previous</Link>}
                {page < totalPages && <Link href={`/?page=${page + 1}`}>Next</Link>}
            </div>
        </main>
    );
}
