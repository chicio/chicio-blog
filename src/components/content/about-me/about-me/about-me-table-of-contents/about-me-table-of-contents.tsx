"use client";

import { Button } from "@/components/design-system/atoms/buttons/button";
import { ProfileHero } from "@/components/design-system/organism/profile-hero";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { useAboutMeTableOfContentsStore } from "./use-about-me-table-of-contents-store";

const sections = [
    { id: "biography", label: "Biography" },
    { id: "technologies", label: "Technologies" },
    { id: "experience", label: "Experience" },
    { id: "open-source", label: "Open Source" },
];

export const AboutMeTableOfContents = () => {
    const { effects } = useAboutMeTableOfContentsStore();

    return (
        <ProfileHero
            name={siteMetadata.author}
            role="Software Engineer"
        >
            <div className="mt-6 flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2">
                {sections.map((section) => (
                    <Button
                        key={section.id}
                        onClick={effects.scrollToSection(section.id)}
                        aria-label={`Jump to ${section.label} section`}
                        className="text-primary-text w-full md:w-auto justify-center"
                    >
                        {section.label}
                    </Button>
                ))}
            </div>
        </ProfileHero>
    );
};
