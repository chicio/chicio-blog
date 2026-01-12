"use client";

import { stagger, Variants } from "framer-motion";
import { FC } from "react";
import { TechnologiesExperience } from "./technologies-experience";
import { TechnologiesSkillsGrid } from "./technologies-skills-grid";
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

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export interface TechnologiesProps {
  author: string;
}

export const Technologies: FC<TechnologiesProps> = ({ author }) => (
  <div className="container-fluid flex max-w-6xl snap-start flex-col py-9">
    <div className='max-w-[1200px] w-full flex flex-col z-10 gap-10'>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
        }}
      >
        <MotionDiv variants={itemVariants}>
          <TechnologiesExperience author={author} />
        </MotionDiv>

        <MotionDiv variants={itemVariants}>
          <TechnologiesSkillsGrid />
        </MotionDiv>
      </MotionDiv>
    </div>
  </div>
);
