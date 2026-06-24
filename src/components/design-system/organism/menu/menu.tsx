"use client";

import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { AnimatePresence, Variants } from "framer-motion";
import { FC } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { Close } from "@/components/design-system/molecules/menu/close";
import { DropdownMenu } from "@/components/design-system/molecules/menu/dropdown-menu";
import { HamburgerMenu } from "@/components/design-system/molecules/menu/hamburger-menu";
import { MenuItemWithTracking } from "@/components/design-system/molecules/menu/menu-item-with-tracking";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { LuCommand } from "react-icons/lu";
import { ImCtrl } from "react-icons/im";
import { useMenuStore } from "./use-menu-store";

const menuVariants: Variants = {
    hidden: {
        y: -80,
        transition: { type: "tween", duration: 0.3 },
    },
    visible: {
        y: 0,
        transition: { type: "tween", duration: 0.3 },
    },
};

const panelVariants: Variants = {
    closed: {
        x: "-100%",
        transition: { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.6 },
    },
    open: {
        x: 0,
        transition: { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.6 },
    },
};

export interface MenuProps {
    trackingCategory: string;
}

export const Menu: FC<MenuProps> = ({ trackingCategory }) => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });
    const { state, effects } = useMenuStore(trackingCategory);
    const { pathname, shouldHideMenu, shouldOpenMenu, modifierKey } = state;
    const { openMenu, closeMenu, handlePaletteTrigger } = effects;

    const baseClassName = (isMobile: boolean) =>
        isMobile ? "mb-2 w-80" : "hidden sm:flex xs:mb-0 xs:w-auto";
    const dropdownClassName = (isMobile: boolean) =>
        isMobile ? "z-50 mb-2 w-80" : "hidden sm:flex xs:mb-0 xs:w-auto z-50";

    const renderMenuItems = (isMobile: boolean) => (
        <>
            <MenuItemWithTracking
                className={baseClassName(isMobile)}
                key={`home-${isMobile ? "mobile" : "desktop"}`}
                to={"/"}
                selected={pathname === "/"}
                trackingData={{
                    action: tracking.action.open_home,
                    category: trackingCategory,
                    label: tracking.label.header,
                }}
                onClickCallback={closeMenu}
            >
                Home
            </MenuItemWithTracking>
            <MenuItemWithTracking
                key={`blog-${isMobile ? "mobile" : "desktop"}`}
                className={baseClassName(isMobile)}
                to={slugs.blog.home}
                selected={pathname.includes(slugs.blog.home)}
                trackingData={{
                    action: tracking.action.open_home,
                    category: trackingCategory,
                    label: tracking.label.header,
                }}
                onClickCallback={closeMenu}
            >
                Blog
            </MenuItemWithTracking>
            <DropdownMenu
                label="Explore"
                className={dropdownClassName(isMobile)}
                items={[
                    {
                        label: "DSA",
                        items: [
                            {
                                label: "Roadmap",
                                to: slugs.dataStructuresAndAlgorithms.roadmap,
                                trackingData: {
                                    action: tracking.action.open_dsa_roadmap,
                                    category: trackingCategory,
                                    label: tracking.label.header,
                                },
                                selected: pathname === slugs.dataStructuresAndAlgorithms.roadmap,
                                onClickCallback: closeMenu,
                            },
                            {
                                label: "Exercises",
                                to: slugs.dataStructuresAndAlgorithms.exercises,
                                trackingData: {
                                    action: tracking.action.open_dsa_exercises,
                                    category: trackingCategory,
                                    label: tracking.label.header,
                                },
                                selected: pathname === slugs.dataStructuresAndAlgorithms.exercises,
                                onClickCallback: closeMenu,
                            },
                        ],
                    },
                    {
                        label: "AI",
                        items: [
                            {
                                label: "Chat",
                                to: slugs.chat,
                                trackingData: {
                                    action: tracking.action.open_chat,
                                    category: trackingCategory,
                                    label: tracking.label.header,
                                },
                                selected: pathname === slugs.chat,
                                onClickCallback: closeMenu,
                            },
                            {
                                label: "MCP",
                                to: slugs.mcp,
                                trackingData: {
                                    action: tracking.action.open_mcp,
                                    category: trackingCategory,
                                    label: tracking.label.header,
                                },
                                selected: pathname === slugs.mcp,
                                onClickCallback: closeMenu,
                            },
                        ],
                    },
                ]}
            />
            <DropdownMenu
                label="The Author"
                className={dropdownClassName(isMobile)}
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
                        onClickCallback: closeMenu,
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
                        onClickCallback: closeMenu,
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
                        onClickCallback: closeMenu,
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
                        onClickCallback: closeMenu,
                    },
                ]}
            />
        </>
    );

    return (
        <>
            <MotionDiv
                className={`menu-container container-fixed fixed right-0 left-0 z-50 my-3 ${shouldOpenMenu ? "xs:block hidden" : ""}`}
                variants={menuVariants}
                animate={shouldHideMenu ? "hidden" : "visible"}
                initial="visible"
            >
                <div
                    className={`${glassmorphismClass} sm:overflow-visible flex-row xs:py-0 xs:pt-0 m-0 my-0 flex min-h-16 items-center gap-1 overflow-hidden px-2`}
                >
                    {renderMenuItems(false)}
                    {!shouldOpenMenu && (
                        <div className="sm:hidden">
                            <HamburgerMenu onClick={openMenu} />
                        </div>
                    )}
                    <button
                        className="ml-auto sm:mr-3 group flex items-center gap-2 px-3 py-1.5 w-auto md:w-60 rounded-lg border border-accent bg-accent/10 hover:border-accent hover:bg-accent/20 transition-all duration-200 cursor-pointer min-h-10"
                        onClick={handlePaletteTrigger}
                        aria-label="Open command palette"
                    >
                        <BiSearchAlt className="size-3.5 shrink-0 text-accent group-hover:text-accent transition-colors duration-200" />
                        <span className="hidden md:block flex-1 text-left font-mono text-sm leading-none text-accent/40 group-hover:text-accent/60 transition-colors duration-200">
                            Search...
                        </span>
                        {modifierKey !== null && (
                            <span className="hidden md:inline-flex items-center gap-1">
                                <kbd className="inline-flex items-center justify-center size-6 rounded font-mono text-sm leading-none border border-accent/50 text-accent/70 group-hover:border-accent group-hover:text-accent transition-colors duration-200">
                                    {modifierKey === "meta" ? (
                                        <LuCommand className="size-3" />
                                    ) : (
                                        <ImCtrl className="size-3" />
                                    )}
                                </kbd>
                                <span className="font-mono text-sm leading-none text-accent/70 group-hover:text-accent transition-colors duration-200">
                                    +
                                </span>
                                <kbd className="inline-flex items-center justify-center size-6 rounded font-mono text-base leading-none border border-accent/50 text-accent/70 group-hover:border-accent group-hover:text-accent transition-colors duration-200">
                                    K
                                </kbd>
                            </span>
                        )}
                    </button>
                </div>
            </MotionDiv>
            <AnimatePresence>
                {shouldOpenMenu && (
                    <MotionDiv
                        className="sm:hidden bg-black-alpha-75 fixed top-0 left-0 z-50 h-full w-full touch-pan-y overflow-y-auto backdrop-blur-sm"
                        style={{ willChange: "transform" }}
                        variants={panelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="flex flex-col items-center gap-1 p-5 pt-[55px]">
                            <div className="absolute top-2.5 left-2.5">
                                <Close onClick={closeMenu} />
                            </div>
                            {renderMenuItems(true)}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </>
    );
};
