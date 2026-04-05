"use client";

import { FC, ReactNode, useId, useState } from "react";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";

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
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = useId();
    const panelId = `accordion-panel-${id}`;
    const triggerId = `accordion-trigger-${id}`;

    const toggle = () => {
        setIsOpen((prev) => !prev);
        onToggle?.();
    };

    return (
        <div className={className}>
            <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={toggle}
                className="flex w-full cursor-pointer items-center justify-between bg-transparent p-0 text-left text-primary-text"
            >
                <div className="flex-1">{title}</div>
                <MotionDiv
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 text-accent"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
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
                <div className="pt-3">{children}</div>
            </MotionDiv>
        </div>
    );
};
