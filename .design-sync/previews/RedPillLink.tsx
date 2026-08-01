import { RedPillLink } from "chicio-blog";

// The red pill is always the "go deeper" / next direction: next DSA topic, next blog page, next
// videogame in the collection.
export const Default = () => (
    <div className="flex">
        <RedPillLink to="/data-structures-and-algorithms/topic/graph">Graph</RedPillLink>
    </div>
);

export const Pagination = () => (
    <div className="flex">
        <RedPillLink to="/blog/page/4">Next</RedPillLink>
    </div>
);

export const LongTopicTitle = () => (
    <div className="flex">
        <RedPillLink to="/data-structures-and-algorithms/topic/longest-increasing-subsequence-dp">
            Longest Increasing Subsequence DP
        </RedPillLink>
    </div>
);
