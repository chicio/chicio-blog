import { borderRadius } from "@/components/design-system/atoms/border-radius";
import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-action-external-with-tracking";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";
import { Heading4 } from "@/components/design-system/atoms/heading4";
import { List } from "@/components/design-system/atoms/list";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Project } from "@/types/projects";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { FC } from "react";
import styled from "styled-components";

const ProjectContainer = styled(motion.div)`
  margin: ${(props) => props.theme.spacing[4]} auto;
  max-width: 1200px;
`;

const ProjectContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectImageContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding: 0;
  margin-top: ${(props) => props.theme.spacing[3]};

  ${mediaQuery.minWidth.md} {
    margin-top: 0;
    padding: ${(props) => props.theme.spacing[6]};
    align-self: stretch;
  }
`;

const ProjectImage = styled(Image)`
  ${borderRadius};
  position: relative;
  z-index: 2;
  box-shadow:
    0 8px 32px ${(props) => props.theme.dark.primaryColor}26,
    0 4px 16px ${(props) => props.theme.dark.generalBackground}4D,
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  object-fit: cover;
  width: 100%;
  height: auto;
  max-width: 500px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${mediaQuery.minWidth.md} {
    height: 100%;
    width: auto;
    max-width: 100%;
  }

  &:hover {
    transform: scale(1.03) translateY(-4px);
    box-shadow:
      0 0 15px ${(props) => props.theme.dark.primaryColor}99,
      0 0 25px ${(props) => props.theme.dark.primaryColor}66,
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: ${(props) => props.theme.dark.primaryColor}CC;
    filter: contrast(1.1) saturate(1.2);
  }
`;

const ProjectTitle = styled(Heading4)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const CallToActionContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing[6]};
  display: flex;
  gap: ${(props) => props.theme.spacing[3]};
  flex-wrap: wrap;
`;

const ProjectItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[4]};

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    gap: ${(props) => props.theme.spacing[4]};
    margin: ${(props) => props.theme.spacing[4]} auto;
  }
`;

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
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

export type ProjectProps = { project: Project };

export const ProjectCard: FC<ProjectProps> = ({ project }) => (
  <ProjectContainer
    variants={cardVariants}
    whileHover="hover"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <GlassmorphismBackground>
      <ProjectItem>
        <ProjectContentContainer>
          <ProjectTitle>{project.name}</ProjectTitle>
          <Paragraph>{project.description}</Paragraph>
          <List>
            {project.features.map((feature) => (
              <li key={`${project.name}${feature}`}>{feature}</li>
            ))}
          </List>
          <CallToActionContainer>
            {project.callToActions.map((callToAction) => (
              <CallToActionExternalWithTracking
                key={callToAction.label}
                href={callToAction.link}
                trackingData={{
                  action: callToAction.trackingAction,
                  category: callToAction.trackingCategory,
                  label: callToAction.trackingLabel,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {callToAction.label}
              </CallToActionExternalWithTracking>
            ))}
          </CallToActionContainer>
        </ProjectContentContainer>
        <ProjectImageContainer>
          <ProjectImage
            width={500}
            height={500}
            alt={project.name}
            src={project.image}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "500px",
            }}
          />
        </ProjectImageContainer>
      </ProjectItem>
    </GlassmorphismBackground>
  </ProjectContainer>
);
