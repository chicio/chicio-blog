"use client";

import { ProfilePhoto } from "@/components/design-system/organism/profile-photo";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { FC, ReactNode } from "react";

export interface ProfileHeroProps {
    name: string;
    role?: string;
    imageSrc?: string;
    imageAlt?: string;
    children?: ReactNode;
}

export const ProfileHero: FC<ProfileHeroProps> = ({ name, role, imageSrc, imageAlt, children }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`my-7 p-4 ${glassmorphismClass}`}>
            <ProfilePhoto author={imageAlt ?? name} src={imageSrc} />
            <div className="text-center">
                <h3 className="text-primary-text mx-0 mt-3 text-center">{name}</h3>
                {role && <h5 className="text-secondary-text text-center">{role}</h5>}
            </div>
            {children}
        </div>
    );
};
