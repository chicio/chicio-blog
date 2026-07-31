"use client";

import { FC, Fragment, ReactNode } from "react";
import type { ContentHeading } from "@/types/content/heading";
import { Accordion } from "@/components/design-system/molecules/accordion/accordion";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import {
    useTableOfContentsStore,
    type TableOfContentsGroup,
    type TableOfContentsTrackingCallbacks,
} from "./use-table-of-contents-store";

export interface TableOfContentsProps {
    headings: ContentHeading[];
    tracking?: TableOfContentsTrackingCallbacks;
}

const inlineNavLabel = "Table of contents";
const railNavLabel = "Table of contents (sidebar)";

export const TableOfContents: FC<TableOfContentsProps> = ({ headings, tracking }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { state, effects } = useTableOfContentsStore(headings, tracking);
    const { groups, activeId, activeGroupId } = state;
    const { handleDetailsToggle, isGroupOpen, toggleGroup, handleNavigate, setRailLinkEl } = effects;

    const headingLinkClassName = (isCurrent: boolean, muted: boolean) =>
        `block w-full ${
            isCurrent
                ? "text-accent font-bold"
                : muted
                  ? "text-secondary hover:text-accent text-sm"
                  : "text-primary-text hover:text-accent"
        }`;

    const renderHeadingLink = (
        heading: ContentHeading,
        muted: boolean,
        isCurrent: boolean,
        isRail: boolean,
    ): ReactNode => (
        <a
            href={`#${heading.id}`}
            onClick={handleNavigate(heading)}
            ref={isRail ? setRailLinkEl(heading.id) : undefined}
            aria-current={activeId === heading.id ? "location" : undefined}
            className={headingLinkClassName(isCurrent, muted)}
        >
            {heading.text}
            <span className="text-secondary ml-1 text-xs">· {heading.readingTime.text}</span>
        </a>
    );

    const renderChildEntry = (heading: ContentHeading, isRail: boolean): ReactNode => (
        <li key={heading.id}>{renderHeadingLink(heading, true, activeId === heading.id, isRail)}</li>
    );

    const renderTopLevelEntry = (heading: ContentHeading, isRail: boolean): ReactNode => (
        <li key={heading.id}>{renderHeadingLink(heading, false, activeGroupId === heading.id, isRail)}</li>
    );

    const renderGroup = (group: TableOfContentsGroup, isRail: boolean): ReactNode => {
        if (group.children.length === 0) {
            return renderTopLevelEntry(group.heading, isRail);
        }

        return (
            <li key={group.heading.id}>
                {renderHeadingLink(group.heading, false, activeGroupId === group.heading.id, isRail)}
                <Accordion
                    title={<span className="sr-only">{`Toggle ${group.heading.text} section`}</span>}
                    forceOpen={isGroupOpen(group.heading.id, isRail)}
                    onToggle={toggleGroup(group.heading.id, isRail)}
                >
                    <ul className="border-accent-alpha-40 ml-3 space-y-1 border-l pl-3">
                        {group.children.map((child) => renderChildEntry(child, isRail))}
                    </ul>
                </Accordion>
            </li>
        );
    };

    return (
        <Fragment>
            <details
                onToggle={handleDetailsToggle}
                className={`${glassmorphismClass.trim()} my-6 rounded-xl px-4 py-3 xl:hidden`}
            >
                <summary className="text-accent cursor-pointer font-bold">Contents</summary>
                <nav aria-label={inlineNavLabel} className="mt-3">
                    <ul className="space-y-2">{groups.map((group) => renderGroup(group, false))}</ul>
                </nav>
            </details>
            {/*
                `xl` is 1600px in this codebase's overridden Tailwind scale (globals.css), not the
                Tailwind-default 1536px `2xl` — the rail must activate on the breakpoint that is actually
                wider than `.container-fixed`'s hard 960px cap plus this rail's own 240px (w-60) width.
                The 504px offset is half of that 960px cap (480px) plus a 24px gap; it is independent of
                which breakpoint triggers it, since `.container-fixed` stays centered and capped at 960px
                at every width from `md` upward. At the minimum activation width (1600px) the gutter per
                side is (1600 - 960) / 2 = 320px, comfortably more than the 264px the rail + gap need.
            */}
            <nav
                aria-label={railNavLabel}
                className={`${glassmorphismClass.trim()} hidden xl:fixed xl:top-32 xl:block xl:max-h-[70vh] xl:w-60 xl:overflow-y-auto xl:rounded-xl xl:p-3 xl:left-[calc(50%+504px)]`}
            >
                <ul className="space-y-2">{groups.map((group) => renderGroup(group, true))}</ul>
            </nav>
        </Fragment>
    );
};
