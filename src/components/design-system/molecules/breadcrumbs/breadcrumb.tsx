"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";

import { TrackingData } from "@/types/configuration/tracking";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { useInView } from "@/components/design-system/utils/hooks/use-in-view";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/utils/hooks/use-scroll-direction";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";

export type BreadcrumbItem =
    | { label: string; href: string; isCurrent: false; trackingData: TrackingData }
    | { label: string; href: string; isCurrent: true };

type ClickableBreadcrumbItem = Extract<BreadcrumbItem, { isCurrent: false }>;

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

interface BreadcrumbContentProps {
    items: BreadcrumbItem[];
    parentItem: ClickableBreadcrumbItem | null;
}

const BreadcrumbContent: FC<BreadcrumbContentProps> = ({ items, parentItem }) => (
    <>
        {parentItem && (
            <ol className="flex sm:hidden min-w-0 flex-row flex-nowrap items-center overflow-hidden">
                <li className="flex min-w-0 items-center">
                    <span className="text-secondary mr-1.5 shrink-0 select-none" aria-hidden="true">
                        <IoMdArrowRoundBack />
                    </span>
                    <StandardInternalLinkWithTracking
                        to={parentItem.href}
                        trackingData={parentItem.trackingData}
                        className="min-w-0 truncate py-2"
                    >
                        {parentItem.label}
                    </StandardInternalLinkWithTracking>
                </li>
            </ol>
        )}
        <ol className="hidden sm:flex min-w-0 flex-row flex-nowrap items-center overflow-hidden">
            {items.map((item, index) => (
                <li
                    key={item.href}
                    className={`flex items-center ${item.isCurrent ? "min-w-0 shrink" : "shrink-0"}`}
                >
                    {index > 0 && (
                        <span className="text-secondary mx-1.5 shrink-0 select-none" aria-hidden="true">
                            {">"}
                        </span>
                    )}
                    {item.isCurrent ? (
                        <span className="text-primary-text block truncate" aria-current="page">
                            {item.label}
                        </span>
                    ) : (
                        <StandardInternalLinkWithTracking
                            to={item.href}
                            trackingData={item.trackingData}
                            className="block truncate py-2 whitespace-nowrap"
                        >
                            {item.label}
                        </StandardInternalLinkWithTracking>
                    )}
                </li>
            ))}
        </ol>
    </>
);

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
    const [ref, isInView] = useInView<HTMLElement>({ threshold: 0 });
    const direction = useScrollDirection();
    const { glassmorphismClass } = useGlassmorphism();

    const parentItem = items.length >= 2
        ? items[items.length - 2] as ClickableBreadcrumbItem
        : null;

    const isVisible = !isInView && direction === ScrollDirection.down;

    return (
        <>
            <nav ref={ref} aria-label="Breadcrumb" className="glow-container mb-6 px-3 py-2 font-mono text-base">
                <BreadcrumbContent items={items} parentItem={parentItem} />
            </nav>
            <motion.nav
                aria-label="Breadcrumb"
                aria-hidden={!isVisible}
                className={`${glassmorphismClass} container-fixed fixed top-12 sm:top-11 right-0 left-0 z-55 px-3 py-2 font-mono text-base`}
                initial={false}
                animate={{
                    y: isVisible ? 0 : -200,
                    pointerEvents: isVisible ? "auto" : "none",
                    transition: { delay: 0.1, duration: 0.4, ease: "linear" },
                }}
                style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
                <BreadcrumbContent items={items} parentItem={parentItem} />
            </motion.nav>
        </>
    );
};
