import { slugs } from "@/types/configuration/slug";
import { siteMetadata } from "@/types/configuration/site-metadata";
import type { MenuNavHrefs } from "@/components/design-system/organism/menu";
import type { FooterNavHrefs, SocialContactLinks } from "@/components/design-system/organism/footer";

export const menuNavHrefs: MenuNavHrefs = {
    blog: slugs.blog.home,
    dsaRoadmap: slugs.dataStructuresAndAlgorithms.roadmap,
    dsaExercises: slugs.dataStructuresAndAlgorithms.exercises,
    chat: slugs.chat,
    mcp: slugs.mcp,
    aboutMe: slugs.aboutMe,
    art: slugs.art,
    videogames: slugs.videogames.home,
    contact: slugs.contact,
};

export const footerNavHrefs: FooterNavHrefs = {
    blog: slugs.blog.home,
    art: slugs.art,
    aboutMe: slugs.aboutMe,
    archive: slugs.blog.blogArchive,
    tags: slugs.blog.tags,
    contact: slugs.contact,
};

export const socialContactLinks: SocialContactLinks = {
    github: siteMetadata.contacts.links.github,
    linkedin: siteMetadata.contacts.links.linkedin,
    medium: siteMetadata.contacts.links.medium,
    devto: siteMetadata.contacts.links.devto,
    twitter: siteMetadata.contacts.links.twitter,
    facebook: siteMetadata.contacts.links.facebook,
    instagram: siteMetadata.contacts.links.instagram,
};
