"use client";

import { FC, ReactNode } from "react";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { IoIosArrowDown } from "react-icons/io";
import { useAccordionStore } from "./use-accordion-store";

interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
    onToggle?: () => void;
}

export const Accordion: FC<AccordionProps> = ({
    title,
    children,
    defaultOpen = false,
    className,
    onToggle,
}) => {
    const { state, effects } = useAccordionStore(defaultOpen, onToggle);
    const { isOpen, panelId, triggerId } = state;
    const { toggle } = effects;

    return (
        <div className={className}>
            <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={toggle}
                className="text-primary-text flex w-full cursor-pointer items-center justify-between bg-transparent px-2 text-left"
            >
                <div className="flex-1">{title}</div>
                <MotionDiv
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-accent ml-2"
                >
                    <IoIosArrowDown />
                </MotionDiv>
            </button>
            <MotionDiv
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="p-2">{children}</div>
            </MotionDiv>
        </div>
    );
};
