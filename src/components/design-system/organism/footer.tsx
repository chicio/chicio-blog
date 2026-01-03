"use client";

import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { MenuItemWithTracking } from "../molecules/menu/menu-item-with-tracking";
import { SocialContacts } from "./social-contacts";

export interface FooterProps {
  author: string;
  trackingCategory: string;
}

export const Footer: FC<FooterProps> = ({ author, trackingCategory }) => (
  <footer className="bg-primary-dark border-t-accent relative w-full shrink-0 snap-start border-t-2 border-solid shadow-lg">
    <div className="flex flex-col w-full items-center">
      <div className="grid grid-cols-2 gap-3 py-7 px-5 w-full sm:grid-cols-[repeat(6,auto)] sm:justify-center sm:max-w-4xl sm:mx-auto">
        <MenuItemWithTracking
          to="/"
          trackingData={{
            action: tracking.action.open_home,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          Home
        </MenuItemWithTracking>
        <MenuItemWithTracking
          to={slugs.blog.home}
          trackingData={{
            action: tracking.action.open_blog,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          Blog
        </MenuItemWithTracking>
        <MenuItemWithTracking
          to={slugs.art}
          trackingData={{
            action: tracking.action.open_art,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          Art
        </MenuItemWithTracking>
        <MenuItemWithTracking
          to={slugs.aboutMe}
          trackingData={{
            action: tracking.action.open_about_me,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          About Me
        </MenuItemWithTracking>
        <MenuItemWithTracking
          to={slugs.blog.blogArchive}
          trackingData={{
            action: tracking.action.open_blog_archive,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          Archive
        </MenuItemWithTracking>
        <MenuItemWithTracking
          to={slugs.blog.tags}
          trackingData={{
            action: tracking.action.open_blog_tags,
            category: trackingCategory,
            label: tracking.label.footer,
          }}
          selected={false}
        >
          Tags
        </MenuItemWithTracking>
      </div>
      <hr />
      <div className="w-full flex flex-col items-center justify-center gap-3 py-6 px-4 bg-gradient-to-b from-general-background-light to-primary-color-dark">
        <SocialContacts
          trackingCategory={trackingCategory}
          trackingLabel={tracking.label.footer}
        />
        <p className="m-0 text-center text-sm md:text-base">
          {`Made with 💝 by ${author} 'Chicio'`}
        </p>
      </div>
    </div>
  </footer>
);