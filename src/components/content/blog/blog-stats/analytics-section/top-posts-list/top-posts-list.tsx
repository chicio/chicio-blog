"use client";

import { FC } from "react";
import type { TopPost } from "@/types/content/analytics-stats";

interface TopPostsListProps {
    data: TopPost[];
}

export const TopPostsList: FC<TopPostsListProps> = ({ data }) => (
    <div className="flex flex-col">
        {data.map((post, index) => (
            <div
                key={post.path}
                className="border-accent-alpha-15 hover:bg-accent-alpha-10 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border-b px-2 py-3 transition-colors"
            >
                <span className="text-accent-alpha-70 w-8 flex-none text-sm font-bold tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-text min-w-0 flex-1 truncate text-sm">{post.title}</span>
                <span className="text-accent text-shadow-sm ml-auto min-w-[70px] text-right text-sm tabular-nums">
                    {post.views.toLocaleString("en-US")}
                </span>
            </div>
        ))}
    </div>
);
