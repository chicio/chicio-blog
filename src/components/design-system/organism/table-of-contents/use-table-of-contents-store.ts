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
}

interface TableOfContentsEffects {
    handleDetailsToggle: () => void;
    isGroupOpen: (id: string, respectScrollSpy: boolean) => boolean;
    toggleGroup: (id: string, respectScrollSpy: boolean) => () => void;
    handleNavigate: (heading: ContentHeading) => () => void;
    setRailLinkEl: (id: string) => (element: HTMLAnchorElement | null) => void;
}

/**
 * A class, not an inline style: it needs to be added/removed from `<html>` (the scrolling box for the
 * whole document), and this is the only feature in the codebase that drives in-page anchor scrolling, so
 * it owns the class rather than the site carrying a permanent global `scroll-behavior: smooth`.
 */
const smoothScrollClassName = "reading-companion-smooth-scroll";

/**
 * How long the scroll-spy waits, after the LAST intersection crossing, before it commits `activeId` to
 * React state. Measured directly against this codebase's own longest DSA topic page: a native anchor jump
 * to a heading ~5500px down crosses several intermediate headings' intersection bands in well under a
 * second, and committing `activeId` on every one of those crossings re-renders both TOC surfaces (each
 * Accordion's own `MotionDiv` included) — main-thread work that, measured on that exact page, stalls the
 * browser's own smooth-scroll animation outright before it reaches the target (confirmed by disabling this
 * effect entirely: the scroll then completes to the pixel every time). Debouncing means no commit happens
 * while the browser is still actively crossing headings — only once, shortly after it settles — so nothing
 * here ever competes with an in-flight scroll. A slow, manual read-through scroll only delays the highlight
 * by this long after the reader passes a heading, which is imperceptible.
 */
const scrollSpyCommitDelayMs = 500;

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
        let commitTimeout: number | undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (commitTimeout !== undefined) {
                            window.clearTimeout(commitTimeout);
                        }
                        const id = entry.target.id;
                        commitTimeout = window.setTimeout(() => {
                            setActiveId(id);
                        }, scrollSpyCommitDelayMs);
                    }
                });
            },
            { rootMargin: "-96px 0px -70% 0px" },
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
            if (commitTimeout !== undefined) {
                window.clearTimeout(commitTimeout);
            }
        };
    }, [headings]);

    /**
     * Rail links register themselves here purely so the active one can be scrolled into view inside the
     * rail's OWN scrollable box (`xl:overflow-y-auto`) below, never through the returned `state`/`effects`
     * object — only the curried setter closing over it is exposed, per the DOM-refs convention.
     */
    const railLinkElements = useRef(new Map<string, HTMLAnchorElement>());

    const setRailLinkEl = useCallback(
        (id: string) => (element: HTMLAnchorElement | null) => {
            if (element) {
                railLinkElements.current.set(id, element);
            } else {
                railLinkElements.current.delete(id);
            }
        },
        [],
    );

    useEffect(() => {
        if (!activeId) {
            return;
        }
        railLinkElements.current.get(activeId)?.scrollIntoView({ block: "nearest" });
    }, [activeId]);

    /**
     * Drives the CSS `scroll-behavior` the browser uses for the native anchor jump below, gated on the
     * app's own motion setting (`useReducedMotions`, not the OS `prefers-reduced-motion` query this
     * codebase deliberately doesn't read). The class lives on `<html>` because that is the scrolling box
     * for the whole document, and it is added/removed here rather than baked permanently into the global
     * stylesheet because this organism is the only thing in the codebase that needs an animated in-page
     * jump.
     */
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle(smoothScrollClassName, !shouldReduceMotion);

        return () => {
            root.classList.remove(smoothScrollClassName);
        };
    }, [shouldReduceMotion]);

    /**
     * `respectScrollSpy` lets the two rendered surfaces (inline `<details>` vs. the fixed `xl` rail) apply
     * different semantics to the SAME override map: the rail may be force-opened reactively by scroll-spy
     * because it sits outside the document's normal flow (opening/closing it costs nothing there), while
     * the inline copy lives in-flow and must never open on its own just because the reader scrolled past a
     * heading — only an explicit click (the override) or the group's own default state opens it there.
     */
    const isGroupOpen = useCallback(
        (id: string, respectScrollSpy: boolean) => {
            const override = groupOverrides.get(id);
            if (override !== undefined) {
                return override;
            }
            return respectScrollSpy && activeGroupId === id;
        },
        [groupOverrides, activeGroupId],
    );

    const handleDetailsToggle = useCallback(() => {
        tracking?.onToggle();
    }, [tracking]);

    /**
     * Records the user's explicit open/closed intent for a group, always relative to what is currently
     * visible to that surface (`isGroupOpen`'s own `respectScrollSpy` semantics), never to the override's
     * own previous value. That is what lets a reader collapse the section they are currently reading — a
     * group forced open only because it is the active scroll-spy target has no override yet, so the first
     * click records an explicit "closed" override that wins over `activeGroupId` from then on, instead of a
     * naive flip re-opening it on the same click.
     */
    const toggleGroup = useCallback(
        (id: string, respectScrollSpy: boolean) => () => {
            setGroupOverrides((previous) => {
                const next = new Map(previous);
                const override = previous.get(id);
                const currentlyOpen = override ?? (respectScrollSpy && activeGroupId === id);
                next.set(id, !currentlyOpen);
                return next;
            });
        },
        [activeGroupId],
    );

    /**
     * Deliberately does NOT call `event.preventDefault()` or `window.history.pushState`. This anchor is a
     * real `<a href="#id">`: letting the browser's native same-document fragment navigation handle the
     * jump (scroll position driven by the CSS `scroll-behavior` toggled above, offset by the existing
     * `scroll-mt-20` on every heading) is what makes the jump zero-JS, keyboard/AT correct, and safe for
     * ⌘-click/middle-click to open in a new tab.
     *
     * Calling `window.history.pushState` by hand here previously raced the Next.js App Router: Next patches
     * `history.pushState`/`replaceState` to track soft navigations, and a manual call was read as one,
     * replaying the router's own scroll restoration against a stale cached position ~100-300ms into the
     * smooth scroll and aborting it before it reached the target. Native fragment navigation never calls
     * the patched function, so it never triggers that replay.
     */
    const handleNavigate = useCallback(
        (heading: ContentHeading) => () => {
            tracking?.onNavigate(heading.text);
        },
        [tracking],
    );

    return {
        state: { groups, activeId, activeGroupId },
        effects: { handleDetailsToggle, isGroupOpen, toggleGroup, handleNavigate, setRailLinkEl },
    };
};
