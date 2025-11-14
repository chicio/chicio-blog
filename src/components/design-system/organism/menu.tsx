"use client";

import {
  SearchBox,
  SearchHits,
} from "@/components/design-system/molecules/menu/search";
import { useSearch } from "@/components/design-system/utils/hooks/use-search";
import {
  NeoRoomEasterEgg,
  whiteRabbitEasterEgg,
} from "@/components/sections/easter-eggs/white-rabbit";
import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { Overlay } from "../atoms/effects/overlay";
import { Close } from "../molecules/menu/close";
import { DropdownMenu } from "../molecules/menu/dropdown-menu";
import { HamburgerMenu } from "../molecules/menu/hamburger-menu";
import { MenuItemWithTracking } from "../molecules/menu/menu-item-with-tracking";
import { useGlassmorphism } from "../utils/hooks/use-glassmorphism";
import {
  ScrollDirection,
  useScrollDirection,
} from "../utils/hooks/use-scroll-direction";

const dsaDropdownItems = (
  trackingCategory: string,
  pathname: string,
  onClickCallback: () => void,
) => [
  {
    label: "Time and space complexity",
    to: slugs.timeAndSpaceComplexity,
    trackingData: {
      action: tracking.action.open_dsa_time_and_space_complexity,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.timeAndSpaceComplexity,
    onClickCallback,
  },
  {
    label: "Arrays",
    to: slugs.arrays,
    trackingData: {
      action: tracking.action.open_dsa_arrays,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.arrays,
    onClickCallback,
  },
  {
    label: "Strings",
    to: slugs.strings,
    trackingData: {
      action: tracking.action.open_dsa_strings,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.strings,
    onClickCallback,
  },
  {
    label: "Bit manipulation",
    to: slugs.bitManipulation,
    trackingData: {
      action: tracking.action.open_dsa_bit_manipulation,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.bitManipulation,
    onClickCallback,
  },
  {
    label: "Hash Tables",
    to: slugs.hashTables,
    trackingData: {
      action: tracking.action.open_dsa_hash_tables,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.hashTables,
    onClickCallback,
  },
  {
    label: "Two Pointers",
    to: slugs.twoPointers,
    trackingData: {
      action: tracking.action.open_dsa_two_pointers,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.twoPointers,
    onClickCallback,
  },
  {
    label: "Prefix Sum",
    to: slugs.prefixSum,
    trackingData: {
      action: tracking.action.open_dsa_prefix_sum,
      category: trackingCategory,
      label: tracking.label.header,
    },
    selected: pathname === slugs.prefixSum,
    onClickCallback,
  },
];

export const menuHeightNumber = 55;

const menuVariants: Variants = {
  hidden: {
    y: -menuHeightNumber,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  visible: {
    y: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

const contentVariants: Variants = {
  collapsed: {
    height: "55px",
    transition: {
      type: "tween",
      ease: [0.4, 0, 0.2, 1],
      duration: 0.6,
    },
  },
  expanded: {
    height: "100dvh",
    transition: {
      type: "tween",
      ease: [0.4, 0, 0.2, 1],
      duration: 0.6,
      delay: 0.3,
    },
  },
};

export interface MenuProps {
  trackingCategory: string;
}

export const Menu: FC<MenuProps> = ({ trackingCategory }) => {
  const pathname = usePathname();
  const direction = useScrollDirection();
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const { handleSearch, resetSearch, search } = useSearch(
    startSearch,
    whiteRabbitEasterEgg,
  );
  const { glassmorphismClass } = useGlassmorphism();
  const shouldHideMenu =
    pathname === slugs.chat ? false : direction === ScrollDirection.down;

  return (
    <>
      <motion.div
        className={`${glassmorphismClass} xs:pl-3 xs:pr-3 menu-container fixed top-0 right-0 left-0 z-50 rounded-tl-none rounded-tr-none border-t-0 p-0 hover:scale-100`}
        variants={menuVariants}
        animate={shouldHideMenu ? "hidden" : "visible"}
        initial="visible"
      >
        <div
          className={`menu-container container-fixed mx-auto my-0 w-full overflow-hidden sm:overflow-visible`}
        >
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate={shouldOpenMenu ? "expanded" : "collapsed"}
            className={`xs:flex-row xs:py-0 xs:px-5 m-0 flex min-h-[55px] flex-col items-center gap-1 pt-[55px] ${shouldOpenMenu ? "hide-scrollbar touch-pan-y overflow-y-scroll" : ""}`}
          >
            <MenuItemWithTracking
              className="xs:mb-0 xs:w-auto mb-2 w-80"
              key="home"
              to={"/"}
              selected={pathname === "/"}
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Home
            </MenuItemWithTracking>
            <MenuItemWithTracking
              key="blog"
              className="xs:mb-0 xs:w-auto mb-2 w-80"
              to={slugs.blog}
              selected={
                pathname.includes(slugs.blog) && pathname !== slugs.aboutMe
              }
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Blog
            </MenuItemWithTracking>
            <DropdownMenu
              label="DSA"
              className="xs:mb-0 xs:w-auto z-50 mb-2 w-80"
              items={dsaDropdownItems(trackingCategory, pathname, () =>
                setShouldOpenMenu(false),
              )}
            />
            <DropdownMenu
              label="The Author"
              className="xs:mb-0 xs:w-auto z-50 mb-2 w-80"
              items={[
                {
                  label: "About me",
                  to: slugs.aboutMe,
                  trackingData: {
                    action: tracking.action.open_about_me,
                    category: trackingCategory,
                    label: tracking.label.header,
                  },
                  selected: pathname === slugs.aboutMe,
                  onClickCallback: () => setShouldOpenMenu(false),
                },
                {
                  label: "Art",
                  to: slugs.art,
                  trackingData: {
                    action: tracking.action.open_art,
                    category: trackingCategory,
                    label: tracking.label.header,
                  },
                  selected: pathname === slugs.art,
                  onClickCallback: () => setShouldOpenMenu(false),
                },
                {
                  label: "Chat",
                  to: slugs.chat,
                  trackingData: {
                    action: tracking.action.open_chat,
                    category: trackingCategory,
                    label: tracking.label.header,
                  },
                  selected: pathname === slugs.chat,
                  onClickCallback: () => setShouldOpenMenu(false),
                },
              ]}
            />
            {!startSearch && (
              <div className="xs:hidden absolute top-2.5 left-2.5">
                {!shouldOpenMenu && (
                  <HamburgerMenu
                    onClick={() => {
                      if (!startSearch) {
                        setShouldOpenMenu(!shouldOpenMenu);
                      }
                    }}
                  />
                )}
                {shouldOpenMenu && (
                  <Close onClick={() => setShouldOpenMenu(!shouldOpenMenu)} />
                )}
              </div>
            )}
            {!shouldOpenMenu && (
              <SearchBox
                startSearch={startSearch}
                onClick={() => {
                  resetSearch();
                  setStartSearch(!startSearch);
                }}
                onChange={handleSearch}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {(shouldOpenMenu || startSearch) && (
          <Overlay
            key="menu-overlay"
            delay={0.05}
            onClick={() => {
              if (shouldOpenMenu) {
                setShouldOpenMenu(false);
              }
              if (startSearch) {
                setStartSearch(false);
              }
            }}
          >
            {search.type === "easterEgg" && (
              <NeoRoomEasterEgg lines={search.terminalLines} />
            )}
            {search.type === "search" &&
              search.results.length > 0 &&
              !shouldOpenMenu && <SearchHits results={search.results} />}
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};
