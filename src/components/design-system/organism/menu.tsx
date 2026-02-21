"use client";

import {
  SearchBox,
  SearchHits,
} from "@/components/design-system/molecules/menu/search";
import { useSearch } from "@/components/design-system/utils/hooks/use-search";
import { whiteRabbitEasterEgg } from "@/components/sections/easter-eggs/white-rabbit";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { AnimatePresence, Variants } from "framer-motion";
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
import { MotionDiv } from "../molecules/animation/motion-div";
import dynamic from "next/dynamic";

const renderMenuItems = (
  isMobile: boolean,
  pathname: string,
  trackingCategory: string,
  setShouldOpenMenu: (open: boolean) => void,
) => {
  const baseClassName = isMobile
    ? "mb-2 w-80"
    : "hidden xs:flex xs:mb-0 xs:w-auto";
  const dropdownClassName = isMobile
    ? "z-50 mb-2 w-80"
    : "hidden xs:flex xs:mb-0 xs:w-auto z-50";

  return (
    <>
      <MenuItemWithTracking
        className={baseClassName}
        key={`home-${isMobile ? "mobile" : "desktop"}`}
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
        key={`blog-${isMobile ? "mobile" : "desktop"}`}
        className={baseClassName}
        to={slugs.blog.home}
        selected={pathname.includes(slugs.blog.home)}
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
        key={`dsa-${isMobile ? "mobile" : "desktop"}`}
        className={baseClassName}
        to={slugs.dataStructuresAndAlgorithms.roadmap}
        selected={pathname.includes(slugs.dataStructuresAndAlgorithms.home)}
        trackingData={{
          action: tracking.action.open_dsa_roadmap,
          category: trackingCategory,
          label: tracking.label.header,
        }}
        onClickCallback={() => setShouldOpenMenu(false)}
      >
        DSA
      </MenuItemWithTracking>
      <DropdownMenu
        label="The Author"
        className={dropdownClassName}
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
            label: "Videogames",
            to: slugs.videogames.home,
            trackingData: {
              action: tracking.action.open_videogame_collection,
              category: trackingCategory,
              label: tracking.label.header,
            },
            selected: pathname === slugs.videogames.home,
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
          {
            label: "Contact me",
            to: slugs.contact,
            trackingData: {
              action: tracking.action.open_contact,
              category: trackingCategory,
              label: tracking.label.header,
            },
            selected: pathname === slugs.contact,
            onClickCallback: () => setShouldOpenMenu(false),
          },
        ]}
      />
    </>
  );
};

const menuVariants: Variants = {
  hidden: {
    y: -80,
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

const panelVariants: Variants = {
  closed: {
    x: "-100%",
    transition: {
      type: "tween",
      ease: [0.4, 0, 0.2, 1],
      duration: 0.6,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "tween",
      ease: [0.4, 0, 0.2, 1],
      duration: 0.6,
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

  const NeoRoomEasterEgg =
    startSearch && search.type === "easterEgg"
      ? dynamic(
          () => import("@/components/sections/easter-eggs/neo-room-easter-egg"),
          { ssr: false },
        )
      : null;

  return (
    <>
      <MotionDiv
        className={`menu-container container-fixed fixed right-0 left-0 z-50 my-3 ${shouldOpenMenu ? "xs:block hidden" : ""}`}
        variants={menuVariants}
        animate={shouldHideMenu ? "hidden" : "visible"}
        initial="visible"
      >
        <div
          className={`${glassmorphismClass} xs:overflow-visible xs:flex-row xs:py-0 xs:pt-0 m-0 my-0 flex min-h-16 flex-col items-center gap-1 overflow-hidden px-2`}
        >
          {renderMenuItems(
            false, //desktop
            pathname,
            trackingCategory,
            setShouldOpenMenu,
          )}
          {!startSearch && !shouldOpenMenu && (
            <div className="xs:hidden absolute top-3.5 left-2.5">
              <HamburgerMenu
                onClick={() => {
                  if (!startSearch) {
                    setShouldOpenMenu(true);
                  }
                }}
              />
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
        </div>
      </MotionDiv>
      <AnimatePresence>
        {shouldOpenMenu && (
          <MotionDiv
            className="xs:hidden bg-black-alpha-75 fixed top-0 left-0 z-50 h-full w-full touch-pan-y overflow-y-auto backdrop-blur-sm"
            style={{ willChange: "transform" }}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col items-center gap-1 p-5 pt-[55px]">
              <div className="absolute top-2.5 left-2.5">
                <Close onClick={() => setShouldOpenMenu(false)} />
              </div>
              {renderMenuItems(
                true, //mobile
                pathname,
                trackingCategory,
                setShouldOpenMenu,
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {startSearch && (
          <Overlay
            key="menu-overlay"
            delay={0.05}
            onClick={() => {
              setStartSearch(false);
            }}
          >
            {search.type === "easterEgg" && NeoRoomEasterEgg && (
              <NeoRoomEasterEgg lines={search.terminalLines} />
            )}
            {search.type === "search" && search.results.length > 0 && (
              <SearchHits results={search.results} />
            )}
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};
