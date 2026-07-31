"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import type { ContentHeading } from "@/types/content/heading";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import type { ComponentStore } from "@/types/component-store";

export interface TableOfContentsTrackingCallbacks {
    onToggle: () => void;
    onNavigate: (label: string) => void;
}

export interface TableOfContentsGroup {
    heading: ContentHeading;
    children: ContentHeading[];
}

interface TableOfContentsState {
    groups: TableOfContentsGroup[];
    activeId: string | undefined;
    activeGroupId: string | undefined;
}

interface TableOfContentsEffects {
    handleDetailsToggle: () => void;
    isGroupOpen: (id: string) => boolean;
    toggleGroup: (id: string) => () => void;
    handleNavigate: (heading: ContentHeading) => (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Groups h3 entries under the nearest preceding h2, in document order. An h3 only ever nests under a
 * group whose own heading is an h2 — a group started by an h3 (a post whose first heading in scope is
 * an h3, or several consecutive top-level h3s in an h3-only document) never accepts further children,
 * so it stays a childless, top-level entry rather than swallowing its siblings into a false hierarchy.
 * No heading is ever lost: an h3 that can't nest becomes its own top-level, childless group.
 */
const groupHeadings = (headings: ContentHeading[]): TableOfContentsGroup[] => {
    const groups: TableOfContentsGroup[] = [];

    for (const heading of headings) {
        const previousGroup = groups[groups.length - 1];
        if (heading.level === 3 && previousGroup?.heading.level === 2) {
            previousGroup.children.push(heading);
        } else {
            groups.push({ heading, children: [] });
        }
    }

    return groups;
};

export const useTableOfContentsStore = (
    headings: ContentHeading[],
    tracking?: TableOfContentsTrackingCallbacks,
): ComponentStore<TableOfContentsState, TableOfContentsEffects> => {
    const shouldReduceMotion = useReducedMotions();
    const [groupOverrides, setGroupOverrides] = useState<Map<string, boolean>>(new Map());
    const [activeId, setActiveId] = useState<string | undefined>(undefined);

    const groups = useMemo(() => groupHeadings(headings), [headings]);

    const activeGroupId = useMemo(() => {
        const activeGroup = groups.find(
            (group) => group.heading.id === activeId || group.children.some((child) => child.id === activeId),
        );

        return activeGroup?.heading.id;
    }, [groups, activeId]);

    useEffect(() => {
        const orderedIds = headings.map((heading) => heading.id);
        const elements = orderedIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        // Only ever advances `activeId` forward on an `isIntersecting` heading, and never clears it when
        // nothing currently sits inside the (thin, near-top) band `rootMargin` carves out. That gap between
        // two headings is exactly the reader's dwell time inside a section's own prose — clearing there
        // would blank the highlight for the whole time the reader is reading that section, only restoring
        // it once the next heading scrolls into the band.
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-96px 0px -70% 0px" },
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
        };
    }, [headings]);

    const isGroupOpen = useCallback(
        (id: string) => {
            const override = groupOverrides.get(id);
            return override ?? activeGroupId === id;
        },
        [groupOverrides, activeGroupId],
    );

    const handleDetailsToggle = useCallback(() => {
        tracking?.onToggle();
    }, [tracking]);

    /**
     * Records the user's explicit open/closed intent for a group, always relative to what is currently
     * visible (`isGroupOpen`), never to the override's own previous value. That is what lets a reader
     * collapse the section they are currently reading — a group forced open only because it is the active
     * scroll-spy target has no override yet, so the first click records an explicit "closed" override
     * that wins over `activeGroupId` from then on, instead of a naive flip re-opening it on the same click.
     */
    const toggleGroup = useCallback(
        (id: string) => () => {
            setGroupOverrides((previous) => {
                const next = new Map(previous);
                const currentlyOpen = previous.get(id) ?? activeGroupId === id;
                next.set(id, !currentlyOpen);
                return next;
            });
        },
        [activeGroupId],
    );

    const handleNavigate = useCallback(
        (heading: ContentHeading) => (event: MouseEvent<HTMLAnchorElement>) => {
            tracking?.onNavigate(heading.text);
            event.preventDefault();
            const element = document.getElementById(heading.id);
            element?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
            window.history.pushState(null, "", `#${heading.id}`);
        },
        [tracking, shouldReduceMotion],
    );

    return {
        state: { groups, activeId, activeGroupId },
        effects: { handleDetailsToggle, isGroupOpen, toggleGroup, handleNavigate },
    };
};
