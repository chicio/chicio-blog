"use client";

import { motion } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";
import { BluePillLink, RedPillLink } from "../links/pills-links";
import { tracking } from "@/types/tracking";

const PillContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[6]};
  margin-top: ${(props) => props.theme.spacing[6]};
  position: relative;
  z-index: 13;

  ${mediaQuery.minWidth.sm} {
    flex-direction: row;
  }
`;

interface MatrixPillsProps {
  redPillHref: string;
  bluePillHref: string;
  redPillText: string;
  bluePillText: string;
  trackingCategory: string;
  trackingLabel: string;
}

export const MatrixChoice: FC<MatrixPillsProps> = ({
  redPillHref,
  bluePillHref,
  redPillText = "Red Pill",
  bluePillText = "Blue Pill",
  trackingCategory,
  trackingLabel
}) => {
  return (
    <PillContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
    >
      <RedPillLink
        to={redPillHref}
        trackingData={{
          category: trackingCategory,
          label: trackingLabel,
          action: tracking.action.red_pill,
        }}
      >
        {redPillText}
      </RedPillLink>
      <BluePillLink
        to={bluePillHref}
        trackingData={{
          category: trackingCategory,
          label: trackingLabel,
          action: tracking.action.blue_pill,
        }}
      >
        {bluePillText}
      </BluePillLink>
    </PillContainer>
  );
};
