"use client";

import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { tracking } from "@/types/tracking";
import { BiBriefcase } from "react-icons/bi";
import { BiSolidGraduation } from "react-icons/bi";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { FC } from "react";
import styled from "styled-components";
import { useTimeline } from "../hooks/useTimeline";

const TimelineContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[4]};
  position: relative;
  padding: ${(props) => props.theme.spacing[4]} 0;
  max-width: 1400px;

  ${mediaQuery.minWidth.md} {
    gap: ${(props) => props.theme.spacing[6]};
    padding: ${(props) => props.theme.spacing[6]} 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      ${(props) => props.theme.colors.primaryColor}80 0%,
      ${(props) => props.theme.colors.primaryColor}40 50%,
      ${(props) => props.theme.colors.primaryColor}80 100%
    );

    ${mediaQuery.minWidth.md} {
      left: 24px;
      width: 3px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: ${(props) => props.theme.spacing[1]};
  position: relative;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    gap: ${(props) => props.theme.spacing[4]};
  }
`;

const TimelineMarker = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primaryColor};
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
  border: 3px solid ${(props) => props.theme.colors.generalBackground};
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 30px ${(props) => props.theme.colors.primaryColor}60;
  }

  ${mediaQuery.minWidth.md} {
    width: 48px;
    height: 48px;
  }
`;

const TimelineContent = styled(motion.div)`
  flex: 1;
  width: 0; /* Force container to respect flex-basis */
  min-width: 0; /* Allow content to shrink below its natural width */
`;

const TimelineHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[1]};
  width: 100%;
`;

const TimelineContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
  width: 100%;
  margin-top: ${(props) => props.theme.spacing[3]};

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    gap: ${(props) => props.theme.spacing[3]};
  }
`;

const TimelineImageContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.colors.accentColor}40;
  background: #ffffff;
  flex-shrink: 0;
  align-self: flex-start;

  ${mediaQuery.minWidth.md} {
    width: 56px;
    height: 56px;
    border-radius: 8px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TimelineTextContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const markerVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.1,
    },
  },
};

export const Timeline: FC = () => {
  const { timeline } = useTimeline();

  const getIcon = (type: "work" | "education") => {
    return type === "work" ? (
      <BiBriefcase className="size-5" />
    ) : (
      <BiSolidGraduation className="size-5" />
    );
  };

  return (
    <TimelineContainer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {timeline.map((item) => (
        <TimelineItem key={item.id} variants={itemVariants} whileHover="hover">
          <TimelineMarker variants={markerVariants} whileHover="hover">
            {getIcon(item.type)}
          </TimelineMarker>

          <TimelineContent variants={cardVariants}>
            <GlassmorphismBackground>
              <TimelineHeader>
                  {item.link ? (
                    <StandardExternalLinkWithTracking
                      trackingData={{
                        action: tracking.action.open_experience_and_education,
                        category: tracking.category.home,
                        label: tracking.label.body,
                      }}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3>{item.title}</h3>
                    </StandardExternalLinkWithTracking>
                  ) : (
                    <h3>{item.title}</h3>
                  )}
                  <h5>{item.subtitle}</h5>
                  <time className="text-xs sm:text-base">{item.date}</time>
              </TimelineHeader>

              <TimelineContentSection>
                <TimelineImageContainer>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={56}
                    height={56}
                    placeholder="blur"
                  />
                </TimelineImageContainer>

                <TimelineTextContent>
                  <p className="m-0 text-left break-words hyphens-auto">{item.description}</p>
                  {item.features && (
                    <ul>
                      {item.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </TimelineTextContent>
              </TimelineContentSection>
            </GlassmorphismBackground>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

