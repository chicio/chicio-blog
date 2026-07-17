"use client";

import Giscus from "@giscus/react";
import { FC } from "react";
import { giscusConfig } from "@/types/configuration/giscus";

/**
 * Renders the live giscus (GitHub Discussions) comment widget below a blog post.
 * Pure configuration wrapper with no interactive state of its own — no store,
 * per the no-pass-through-store convention. Not gated behind cookie consent:
 * giscus sets no tracking cookies.
 *
 * The custom Matrix theme (public/giscus-matrix.css) is served from the absolute
 * production URL, so on localhost giscus falls back to its unstyled default theme;
 * this is expected in local development.
 */
export const BlogComments: FC = () => <Giscus {...giscusConfig} />;
