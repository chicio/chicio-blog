import Image from "next/image";
import { Technology } from "@/types/technology";
import { FC } from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";

const TechnologyCardContainer = styled(motion.div)`
  ${glassmorphism}
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  min-height: 140px;
  max-width: 150px;

  ${mediaQuery.minWidth.sm} {
    max-width: 250px;
  }
`;

const TechnologyImageContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};

  img {
    object-fit: contain;
  }
`;

const TechnologyName = styled.span`
  color: ${(props) => props.theme.dark.primaryTextColor};
  font-size: ${(props) => props.theme.fontSizes[1]};
  text-align: center;
  font-weight: 500;
`;

const ExperienceYears = styled.span`
  color: ${(props) => props.theme.dark.accentColor};
  font-size: ${(props) => props.theme.fontSizes[0]};
  margin-top: ${(props) => props.theme.spacing[1]};
`;

const cardVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, type: "spring", stiffness: 100 },
  },
};

export const TechnologyCard: FC<{ tech: Technology, index: number }> = ({ tech, index }) => (
  <TechnologyCardContainer
    key={tech.name}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <TechnologyImageContainer>
      <Image
        src={tech.image}
        alt={tech.name}
        placeholder="blur"
        width={60}
        height={60}
      />
    </TechnologyImageContainer>
    <TechnologyName>{tech.name}</TechnologyName>
    <ExperienceYears>{tech.years}</ExperienceYears>
  </TechnologyCardContainer>
);
