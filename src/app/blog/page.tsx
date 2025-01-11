import BlogPage from '@/app/blog/page/[page]/page';

export default async function BlogHome() {
    const params = Promise.resolve({ page: '1' });
    return <BlogPage params={params} />;
}
