import { TrackingData } from "@/types/tracking";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useReducedMotions } from "../../utils/hooks/use-reduced-motions";
import { MenuItemWithTracking } from "./menu-item-with-tracking";

export interface DropdownMenuItem {
  label: string;
  to: string;
  trackingData: TrackingData;
  selected?: boolean;
  onClickCallback?: () => void;
}

export interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[];
  className?: string;
  chevronClassName?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  label,
  items,
  className = "",
  chevronClassName = "",
}) => {
  const shouldReduceMotions = useReducedMotions();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = items.some(item => item.selected);

  const handleBlur = (
    e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div
      className={`relative z-50 mb-4 sm:mb-0`}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        className={`${className} xs:px-6 xs:py-1 hover:bg-accent-alpha-10 hover:text-accent hover:border-accent relative flex flex-nowrap items-center justify-center gap-2 rounded-xl border border-solid px-2 py-2 text-center text-sm leading-normal text-shadow-md md:text-base ${open || selected ? "border-accent bg-accent-alpha-15 text-accent" : "border-transparent"}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{label}</span>
        <BiChevronDown
          className={`text-matrix-green transition-transform duration-200 ${chevronClassName} ${open ? "rotate-180" : "rotate-0"}`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`glow-container xs:min-w-[180px] ${shouldReduceMotions ? "sm:bg-general-background" : "sm:bg-general-background/90"} relative mt-2 w-full rounded-xl py-2 sm:absolute sm:right-0 sm:left-0 sm:w-auto`}
            tabIndex={-1}
            role="menu"
          >
            {items.map((item, idx) => (
              <MenuItemWithTracking
                key={item.label + idx}
                to={item.to}
                trackingData={item.trackingData}
                selected={item.selected ?? false}
                className="m-2"
                onClickCallback={() => {
                  setOpen(false);
                  item.onClickCallback?.();
                }}
              >
                {item.label}
              </MenuItemWithTracking>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
