"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";

import { BreadcrumbItem, Breadcrumb } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { useInView } from "@/components/design-system/utils/hooks/use-in-view";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/utils/hooks/use-scroll-direction";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";

type ClickableBreadcrumbItem = Extract<BreadcrumbItem, { isCurrent: false }>;

interface StickyBreadcrumbProps {
    items: BreadcrumbItem[];
}

export const StickyBreadcrumb: FC<StickyBreadcrumbProps> = ({ items }) => {
    const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0 });
    const direction = useScrollDirection();
    const { glassmorphismClass } = useGlassmorphism();

    const parentItem =
        items.length >= 2 ? (items[items.length - 2] as ClickableBreadcrumbItem) : null;

    const isVisible = !isInView && direction === ScrollDirection.down;

    return (
        <>
            <div ref={ref}>
                <Breadcrumb items={items} />
            </div>
            {parentItem && (
                <motion.div
                    aria-hidden={!isVisible}
                    className={`${glassmorphismClass} container-fixed fixed top-20 right-0 left-0 z-55 my-3 px-3 py-2 font-mono text-base`}
                    initial={false}
                    animate={{
                        y: isVisible ? 0 : -200,
                        pointerEvents: isVisible ? "auto" : "none",
                        transition: { delay: 0.1, duration: 0.4, ease: "linear" },
                    }}
                    style={{ pointerEvents: isVisible ? "auto" : "none" }}
                >
                    <nav aria-label="Sticky breadcrumb">
                        <ol className="flex min-w-0 flex-row flex-nowrap items-center overflow-hidden">
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
                    </nav>
                </motion.div>
            )}
        </>
    );
};
