'use client'

import { FC } from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
import { mediaQuery } from "../../design-system/utils-css/media-query";
import { Paragraph } from "../../design-system/atoms/paragraph";
import { List } from "../../design-system/atoms/list";
import { Time } from "../../design-system/atoms/time";
import { Heading4 } from "../../design-system/atoms/heading4";
import { Heading6 } from "../../design-system/atoms/heading6";
import { GlassmorphismBackground } from "../../design-system/atoms/glassmorphism-background";
import { StandardExternalLinkWithTracking } from "../../design-system/atoms/standard-external-link-with-tracking";
import { Briefcase } from "@styled-icons/boxicons-regular";
import { GraduationCap } from "@styled-icons/fa-solid";
import { tracking } from "@/types/tracking";
import Image from "next/image";
import { useTimeline } from "@/components/home/hooks/useTimeline";

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
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      ${(props) => props.theme.dark.primaryColor}80 0%,
      ${(props) => props.theme.dark.primaryColor}40 50%,
      ${(props) => props.theme.dark.primaryColor}80 100%
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
  background: ${(props) => props.theme.dark.primaryColor};
  color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  border: 3px solid ${(props) => props.theme.dark.generalBackground};
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 30px ${(props) => props.theme.dark.primaryColor}60;
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

const TimelineCard = styled(GlassmorphismBackground)`
  padding: ${(props) => props.theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
  width: 100%;
  box-sizing: border-box;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[4]};
    gap: ${(props) => props.theme.spacing[3]};
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[1]};
  width: 100%;

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${(props) => props.theme.spacing[3]};
  }
`;

const TimelineHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[1]};
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
`;

const TimelineTitle = styled(Heading4)`
  margin: 0;
  background: linear-gradient(135deg, ${(props) => props.theme.dark.primaryColor}, ${(props) => props.theme.dark.accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  word-wrap: break-word;
  hyphens: auto;
  font-size: ${(props) => props.theme.fontSizes[4]};

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[5]};
  }
`;

const TimelineSubtitle = styled(Heading6)`
  margin: 0;
  color: ${(props) => props.theme.dark.accentColor};
  word-wrap: break-word;
  hyphens: auto;
  font-size: ${(props) => props.theme.fontSizes[1]};

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;

const TimelineDate = styled(Time)`
  color: ${(props) => props.theme.dark.primaryColor};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSizes[1]};
  flex-shrink: 0;

  ${mediaQuery.minWidth.md} {
    align-self: flex-start;
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;

const TimelineContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
  width: 100%;

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
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  background: #FFFFFF;
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

const TimelineDescription = styled(Paragraph)`
  margin: 0;
  text-align: left;
  word-wrap: break-word;
  hyphens: auto;
  line-height: 1.5;
  font-size: ${(props) => props.theme.fontSizes[1]};

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;

const TimelineFeatures = styled(List)`
  margin: 0;
  padding: 0;
  
  li {
    position: relative;
    padding-left: ${(props) => props.theme.spacing[3]};
    margin-bottom: ${(props) => props.theme.spacing[1]};
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
    font-size: ${(props) => props.theme.fontSizes[0]};
    
    &::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: ${(props) => props.theme.dark.primaryColor};
      font-weight: bold;
    }

    ${mediaQuery.minWidth.md} {
      font-size: ${(props) => props.theme.fontSizes[1]};
      padding-left: ${(props) => props.theme.spacing[4]};
    }
  }
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
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const markerVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2
    }
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.1
    }
  }
};

export const Timeline: FC = () => {
  const { timeline } = useTimeline();

  const getIcon = (type: "work" | "education") => {
    return type === "work" ? (
      <Briefcase size={20} />
    ) : (
      <GraduationCap size={18} />
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
        <TimelineItem
          key={item.id}
          variants={itemVariants}
          whileHover="hover"
        >
          <TimelineMarker
            variants={markerVariants}
            whileHover="hover"
          >
            {getIcon(item.type)}
          </TimelineMarker>

          <TimelineContent variants={cardVariants}>
            <TimelineCard>
              <TimelineHeader>
                <TimelineHeaderContent>
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
                      <TimelineTitle>{item.title}</TimelineTitle>
                    </StandardExternalLinkWithTracking>
                  ) : (
                    <TimelineTitle>{item.title}</TimelineTitle>
                  )}
                  <TimelineSubtitle>{item.subtitle}</TimelineSubtitle>
                </TimelineHeaderContent>

                <TimelineDate>{item.date}</TimelineDate>
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
                  <TimelineDescription>{item.description}</TimelineDescription>
                  {item.features && (
                    <TimelineFeatures>
                      {item.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </TimelineFeatures>
                  )}
                </TimelineTextContent>
              </TimelineContentSection>
            </TimelineCard>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};
