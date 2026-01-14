"use client";

import { stagger, Variants } from "framer-motion";
import { FC } from "react";
import { SectionTitle } from "./section-title";
import { Timeline } from "./timeline";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.3, { startDelay: 0.2 }),
    },
  },
};

const JobsTimeline: FC = () => (
  <div className="container-fluid snap-start flex flex-col max-w-6xl py-9">
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <SectionTitle>Experience</SectionTitle>
      <Timeline />
    </MotionDiv>
  </div>
);

export default JobsTimeline;