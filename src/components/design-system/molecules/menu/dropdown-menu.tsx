import { FC, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlassmorphism } from "../../utils/hooks/use-glassmorphism";
import { BiChevronDown } from "react-icons/bi";
import { MenuItemWithTracking } from "./menu-item-with-tracking";
import { TrackingData } from "@/types/tracking";
import { useIsMobile } from "../../utils/hooks/use-is-mobile";

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
  const [open, setOpen] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  // Close dropdown on blur (accessibility)
  const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className} z-50`}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        className={`flex items-center gap-2 px-2 py-2 xs:px-6 xs:py-1 text-sm md:text-base text-shadow-md text-center no-underline border border-solid rounded-xl transition-all duration-300 flex-nowrap bg-transparent hover:bg-accent-alpha-10 hover:text-accent hover:border-accent ${open ? "border-accent bg-accent-alpha-15" : "border-transparent"}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{label}</span>
        <BiChevronDown className={`text-matrix-green transition-transform duration-200 ${chevronClassName} ${open ? "rotate-180" : "rotate-0"}`} size={20} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isMobile ? 0 : -8 }}
            transition={{ duration: 0.18 }}
            className={
              `${isMobile
                ? `relative w-full mt-2 glow-container rounded-xl py-2 xs:min-w-[180px]` // inline in menu
                : `absolute left-0 right-0 mt-2 glow-container bg-general-background/90 rounded-xl py-2 xs:min-w-[180px]` // floating
              }`
            }
            tabIndex={-1}
            role="menu"
          >
            {items.map((item, idx) => (
              <MenuItemWithTracking
                key={item.label + idx}
                to={item.to}
                trackingData={item.trackingData}
                selected={item.selected ?? false}
                className="block w-full text-left px-4 py-2 hover:bg-accent-alpha-10 hover:text-accent rounded-lg transition-all duration-200"
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
