"use client";

import { ProfilePhoto } from "../profile-photo";
import type { ImageComponent } from "../../atoms/effects/plain-image";
import { useGlassmorphism } from "../../hooks/use-glassmorphism";
import { FC, ReactNode } from "react";

export interface ProfileHeroProps {
    name: string;
    role?: string;
    imageSrc?: string;
    imageAlt?: string;
    children?: ReactNode;
    imageComponent?: ImageComponent;
}

export const ProfileHero: FC<ProfileHeroProps> = ({ name, role, imageSrc, imageAlt, children, imageComponent }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`my-7 p-4 ${glassmorphismClass}`}>
            <ProfilePhoto author={imageAlt ?? name} src={imageSrc} imageComponent={imageComponent} />
            <div className="text-center">
                <h3 className="text-primary-text mx-0 mt-3 text-center">{name}</h3>
                {role && <h5 className="text-secondary-text text-center">{role}</h5>}
            </div>
            {children}
        </div>
    );
};
