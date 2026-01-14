"use client";

import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";
import dynamic from "next/dynamic";

const Technologies = dynamic(
  () => import("@/components/sections/home/components/technologies"),
);

const Projects = dynamic(
  () => import("@/components/sections/home/components/projects"),
);

const JobsTimeline = dynamic(
  () => import("@/components/sections/home/components/jobs-timeline"),
);

const Footer = dynamic(
  () => import("@/components/design-system/organism/footer"),
);

export const BelowTheFoldContent: FC = () => {
  return <>
        <Technologies author={siteMetadata.author} />
        <Projects />
        <JobsTimeline />
        <Footer
          author={siteMetadata.author}
          trackingCategory={tracking.category.home}
        />  
  </>;
};
