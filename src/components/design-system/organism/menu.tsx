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
import { HamburgerMenu } from "../molecules/menu/hamburger-menu";
import { MenuItemWithTracking } from "../molecules/menu/menu-item-with-tracking";
import {
  ScrollDirection,
  useScrollDirection,
} from "../utils/hooks/use-scroll-direction";
import { useGlassmorphism } from "../utils/hooks/use-glassmorphism";

export const menuHeightNumber = 55;

const menuVariants: Variants = {
  hidden: {
    y: -menuHeightNumber,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
};

const contentVariants: Variants = {
  collapsed: {
    maxHeight: menuHeightNumber,
    transition: {
      type: "tween",
    },
  },
  expanded: {
    maxHeight: 400,
    transition: {
      type: "tween",
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
        className="menu-container container-fixed xs:pl-3 xs:pr-3 fixed top-0 right-0 left-0 z-50 p-0"
        variants={menuVariants}
        animate={shouldHideMenu ? "hidden" : "visible"}
        initial="visible"
      >
        <div className={`${glassmorphismClass}xs:border-r-1 xs:border-l-1 mx-auto my-0 w-full overflow-hidden rounded-t-none border-t-0 border-r-0 border-l-0`}>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate={shouldOpenMenu ? "expanded" : "collapsed"}
            className="xs:flex-row xs:py-0 xs:px-5 m-0 flex min-h-[55px] flex-col items-center pt-[55px]"
          >
            <MenuItemWithTracking
              className="w-full xs:w-auto sm:mr-5"
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
              className="w-80 mb-2 xs:mb-0 xs:w-auto sm:mr-5"
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
            <MenuItemWithTracking
              key="art"
              className="w-80 mb-2 xs:mb-0 xs:w-auto sm:mr-5"
              to={slugs.art}
              selected={pathname === slugs.art}
              trackingData={{
                action: tracking.action.open_art,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Art
            </MenuItemWithTracking>
            <MenuItemWithTracking
              key="aboutMe"
              className="w-80 mb-2 xs:mb-0 xs:w-auto sm:mr-5"
              to={slugs.aboutMe}
              selected={pathname === slugs.aboutMe}
              trackingData={{
                action: tracking.action.open_about_me,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              About me
            </MenuItemWithTracking>
            <MenuItemWithTracking
              key="chat"
              className="w-80 mb-2 xs:mb-0 xs:w-auto sm:mr-5"
              to={slugs.chat}
              selected={pathname === slugs.chat}
              trackingData={{
                action: tracking.action.open_chat,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Chat
            </MenuItemWithTracking>
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
            delay={0.1}
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
