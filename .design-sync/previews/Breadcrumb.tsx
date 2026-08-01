import { Breadcrumb } from "chicio-blog";

export const Default = () => (
    <Breadcrumb
        items={[
            { label: "DSA", href: "/data-structures-and-algorithms/roadmap", isCurrent: false },
            { label: "Graph", href: "/data-structures-and-algorithms/topic/graph", isCurrent: true },
        ]}
    />
);

export const DeepTrail = () => (
    <Breadcrumb
        items={[
            { label: "DSA", href: "/data-structures-and-algorithms/roadmap", isCurrent: false },
            { label: "Graph", href: "/data-structures-and-algorithms/topic/graph", isCurrent: false },
            {
                label: "Number of Islands",
                href: "/data-structures-and-algorithms/topic/graph/exercise/number-of-islands",
                isCurrent: true,
            },
        ]}
    />
);

export const SingleLevel = () => (
    <Breadcrumb items={[{ label: "Blog", href: "/blog", isCurrent: true }]} />
);
