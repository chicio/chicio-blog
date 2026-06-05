"use client";

import { Button } from "@/components/design-system/atoms/buttons/button";
import { ProfilePhoto } from "@/components/design-system/organism/profile-photo";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { siteMetadata } from "@/types/configuration/site-metadata";

const sections = [
    { id: "biography", label: "Biography" },
    { id: "technologies", label: "Technologies" },
    { id: "experience", label: "Experience" },
    { id: "open-source", label: "Open Source" },
];

export const AboutMeTableOfContents = () => {
    const { glassmorphismClass } = useGlassmorphism();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className={`my-7 p-4 ${glassmorphismClass}`}>
            <ProfilePhoto author="Fabrizio Duroni" />
            <div className="text-center">
                <h3 className="text-primary-text mx-0 mt-3 text-center">
                    {siteMetadata.author}
                </h3>
                <h5 className="text-secondary-text text-center">
                    {"Software Engineer"}
                </h5>
            </div>
            <div className="mt-6 flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2">
                {sections.map((section) => (
                    <Button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        aria-label={`Jump to ${section.label} section`}
                        className="text-primary-text w-full md:w-auto justify-center"
                    >
                        {section.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};
