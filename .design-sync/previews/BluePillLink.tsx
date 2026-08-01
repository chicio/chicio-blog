import { BluePillLink } from "chicio-blog";

// The blue pill is always the "stay where you are" / previous direction in this design system:
// previous DSA topic, previous blog page, previous videogame.
export const Default = () => (
    <div className="flex">
        <BluePillLink to="/data-structures-and-algorithms/topic/binary-search">Binary Search</BluePillLink>
    </div>
);

export const Pagination = () => (
    <div className="flex">
        <BluePillLink to="/blog/page/2">Previous</BluePillLink>
    </div>
);

export const LongTopicTitle = () => (
    <div className="flex">
        <BluePillLink to="/data-structures-and-algorithms/topic/binary-search-tree">
            Binary Search Tree and Ordered Set
        </BluePillLink>
    </div>
);
