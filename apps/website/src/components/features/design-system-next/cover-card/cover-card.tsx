"use client";

import NextImage from "next/image";
import { FC } from "react";
import { CoverCard as DesignSystemCoverCard, type CoverCardProps } from "matrix-design-system";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { CoverCardProps };

/** CoverCard bound to next/image and next/link. See design-system-next/image-glow for why this layer exists. */
export const CoverCard: FC<Omit<CoverCardProps, "imageComponent" | "linkComponent">> = (props) => (
    <DesignSystemCoverCard {...props} imageComponent={NextImage} linkComponent={NextLink} />
);
