"use client";

import { FC, ReactNode, useId, useState } from "react";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { IoIosArrowDown } from "react-icons/io";

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
