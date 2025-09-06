"use client";

import { motion, stagger, Variants } from "framer-motion";
import { FC } from "react";
import { SectionTitle } from "./section-title";
import { Timeline } from "./timeline";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.3, { startDelay: 0.2 }),
    },
  },
};

export const JobsTimeline: FC = () => (
  <div className="container-fluid snap-start flex flex-col max-w-6xl py-9">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <SectionTitle>Experience</SectionTitle>
      <Timeline />
    </motion.div>
  </div>
);
