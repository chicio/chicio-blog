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

export type { TableOfContentsTrackingCallbacks };

export interface TableOfContentsProps {
    headings: ContentHeading[];
    tracking?: TableOfContentsTrackingCallbacks;
}

const navLabel = "Table of contents";

export const TableOfContents: FC<TableOfContentsProps> = ({ headings, tracking }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { state, effects } = useTableOfContentsStore(headings, tracking);
    const { groups, activeId, activeGroupId, manuallyOpenGroupIds } = state;
    const { handleDetailsToggle, toggleGroup, handleNavigate } = effects;

    const isGroupOpen = (id: string) => manuallyOpenGroupIds.has(id) || activeGroupId === id;

    const entryClassName = (id: string) =>
        `w-full cursor-pointer bg-transparent text-left text-sm ${
            activeId === id ? "text-accent font-bold" : "text-secondary hover:text-accent"
        }`;

    const renderEntry = (heading: ContentHeading): ReactNode => (
        <li key={heading.id}>
            <button
                type="button"
                onClick={handleNavigate(heading)}
                aria-current={activeId === heading.id ? "location" : undefined}
                className={entryClassName(heading.id)}
            >
                {heading.text}
                <span className="text-secondary ml-1 text-xs">· {heading.readingTime.text}</span>
            </button>
        </li>
    );

    const renderGroup = (group: TableOfContentsGroup): ReactNode => (
        <li key={group.heading.id}>
            {group.children.length > 0 ? (
                <Accordion
                    title={
                        <span className={activeGroupId === group.heading.id ? "text-accent font-bold" : ""}>
                            {group.heading.text}
                            <span className="text-secondary ml-1 text-xs">· {group.heading.readingTime.text}</span>
                        </span>
                    }
                    forceOpen={isGroupOpen(group.heading.id)}
                    onToggle={toggleGroup(group.heading.id)}
                >
                    <ul className="border-accent-alpha-40 ml-3 space-y-1 border-l pl-3">
                        {group.children.map(renderEntry)}
                    </ul>
                </Accordion>
            ) : (
                renderEntry(group.heading)
            )}
        </li>
    );

    return (
        <Fragment>
            <details
                onToggle={handleDetailsToggle}
                className={`${glassmorphismClass} container-fixed my-6 rounded-xl px-4 py-3 2xl:hidden`}
            >
                <summary className="text-accent cursor-pointer font-bold">Contents</summary>
                <nav aria-label={navLabel} className="mt-3">
                    <ul className="space-y-2">{groups.map(renderGroup)}</ul>
                </nav>
            </details>
            <nav
                aria-label={navLabel}
                className={`${glassmorphismClass} hidden 2xl:fixed 2xl:top-32 2xl:block 2xl:max-h-[70vh] 2xl:w-60 2xl:overflow-y-auto 2xl:rounded-xl 2xl:p-3 2xl:left-[calc(50%+504px)]`}
            >
                <ul className="space-y-2">{groups.map(renderGroup)}</ul>
            </nav>
        </Fragment>
    );
};
