"use client";

import { useCallback } from "react";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { EffectsStore } from "@/types/component-store";

interface PostAuthorsEffects {
    onClickAuthor: () => void;
}

export const usePostAuthorsStore = (): EffectsStore<PostAuthorsEffects> => {
    const onClickAuthor = useCallback(() => {
        trackWith({
            category: tracking.category.blog_post,
            label: tracking.label.body,
            action: tracking.action.open_blog_author,
        });
    }, []);

    return { effects: { onClickAuthor } };
};
