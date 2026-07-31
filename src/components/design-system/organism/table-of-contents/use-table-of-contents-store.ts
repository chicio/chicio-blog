"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    manuallyOpenGroupIds: Set<string>;
}

interface TableOfContentsEffects {
    handleDetailsToggle: () => void;
    toggleGroup: (id: string) => () => void;
    handleNavigate: (heading: ContentHeading) => () => void;
}

/**
 * Groups h3 entries under the nearest preceding h2, in document order. A leading h3 with no preceding
 * h2 in the list (a post whose first heading in scope is an h3) becomes its own top-level, childless
 * group rather than being dropped — no heading is ever lost.
 */
const groupHeadings = (headings: ContentHeading[]): TableOfContentsGroup[] => {
    const groups: TableOfContentsGroup[] = [];

    for (const heading of headings) {
        if (heading.level === 3 && groups.length > 0) {
            groups[groups.length - 1].children.push(heading);
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
    const [manuallyOpenGroupIds, setManuallyOpenGroupIds] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string | undefined>(undefined);
    const visibleIdsRef = useRef<Set<string>>(new Set());

    const groups = useMemo(() => groupHeadings(headings), [headings]);

    useEffect(() => {
        const orderedIds = headings.map((heading) => heading.id);
        const elements = orderedIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        const visibleIds = visibleIdsRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleIds.add(entry.target.id);
                    } else {
                        visibleIds.delete(entry.target.id);
                    }
                });

                const currentlyVisible = orderedIds.filter((id) => visibleIds.has(id));
                setActiveId(currentlyVisible[currentlyVisible.length - 1]);
            },
            { rootMargin: "-96px 0px -70% 0px" },
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
            visibleIds.clear();
        };
    }, [headings]);

    const activeGroupId = useMemo(() => {
        const activeGroup = groups.find(
            (group) => group.heading.id === activeId || group.children.some((child) => child.id === activeId),
        );

        return activeGroup?.heading.id;
    }, [groups, activeId]);

    const handleDetailsToggle = useCallback(() => {
        tracking?.onToggle();
    }, [tracking]);

    const toggleGroup = useCallback(
        (id: string) => () => {
            setManuallyOpenGroupIds((previous) => {
                const next = new Set(previous);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        },
        [],
    );

    const handleNavigate = useCallback(
        (heading: ContentHeading) => () => {
            tracking?.onNavigate(heading.text);
            const element = document.getElementById(heading.id);
            element?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
        },
        [tracking, shouldReduceMotion],
    );

    return {
        state: { groups, activeId, activeGroupId, manuallyOpenGroupIds },
        effects: { handleDetailsToggle, toggleGroup, handleNavigate },
    };
};
