import { PaginationNavigation } from "chicio-blog";

export const Default = () => (
    <PaginationNavigation
        previousPageUrl="/blog/posts/2"
        nextPageUrl="/blog/posts/4"
        onPreviousClick={() => {}}
        onNextClick={() => {}}
    />
);

export const FirstPage = () => (
    <PaginationNavigation previousPageUrl={undefined} nextPageUrl="/blog/posts/2" onNextClick={() => {}} />
);

export const LastPage = () => (
    <PaginationNavigation
        previousPageUrl="/blog/posts/11"
        nextPageUrl={undefined}
        onPreviousClick={() => {}}
    />
);
