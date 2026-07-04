"use client";

import { useCallback } from "react";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";
import { useInViewList } from "@/components/design-system/hooks/use-in-view-list";

interface AuthorCardState {
    isInView: boolean;
}

interface AuthorCardEffects {
    setEl: (el: HTMLDivElement | null) => void;
    onClickAuthor: () => void;
}

export const useAuthorCardStore = (): ComponentStore<AuthorCardState, AuthorCardEffects> => {
    const [setEl, isInView] = useInViewList<HTMLDivElement>({ rootMargin: "600px" });

    const onClickAuthor = useCallback(() => {
        trackWith({
            category: tracking.category.blog_authors,
            label: tracking.label.body,
            action: tracking.action.open_blog_author,
        });
    }, []);

    return {
        state: { isInView },
        effects: { setEl, onClickAuthor },
    };
};
