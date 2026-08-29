"use client";

import NextImage from "next/image";
import { FC } from "react";
import {
    BrandHeader as DesignSystemBrandHeader,
    type BrandHeaderProps,
} from "@/components/design-system/organism/header/brand-header";
import logoImage from "../../../../../public/media/logo.png";

export type BrandHeaderNextProps = Omit<BrandHeaderProps, "imageComponent" | "logo">;

/**
 * BrandHeader bound to next/image and to this site's logo. The design system ships no assets of its
 * own, so the logo is injected here.
 */
export const BrandHeader: FC<BrandHeaderNextProps> = (props) => (
    <DesignSystemBrandHeader {...props} logo={logoImage} imageComponent={NextImage} />
);
