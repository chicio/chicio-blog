import {FC} from "react";
import styled, {TransientProps} from "styled-components";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {borderRadius} from "@/components/design-system/atoms/border-radius";
import {Paragraph} from "@/components/design-system/atoms/paragraph";
import {List} from "@/components/design-system/atoms/list";
import {CallToActionExternalWithTracking} from "@/components/design-system/atoms/call-to-action-external-with-tracking";
import Image from 'next/image';
import {Project} from "@/types/projects";
import {Heading4} from "@/components/design-system/atoms/heading4";
import { motion, Variants } from "framer-motion";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";


interface ProjectContainerProps {
  reverse: boolean;
}

const ProjectContainer = styled(motion.div)<TransientProps<ProjectContainerProps>>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.theme.spacing[8]} auto;
  gap: ${(props) => props.theme.spacing[4]};
  max-width: 1200px;

  ${mediaQuery.minWidth.md} {
    flex-direction: ${(props) => (props.$reverse ? "row-reverse" : "row")};
    gap: ${(props) => props.theme.spacing[10]};
    margin: ${(props) => props.theme.spacing[12]} auto;
  }
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
  padding: ${(props) => props.theme.spacing[4]};
  
  ${mediaQuery.minWidth.md} {
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
      0 0 20px ${(props) => props.theme.dark.primaryColor}99,
      0 0 40px ${(props) => props.theme.dark.primaryColor}66,
      0 0 60px ${(props) => props.theme.dark.primaryColor}33,
      0 16px 64px ${(props) => props.theme.dark.primaryColor}1A,
      0 8px 32px ${(props) => props.theme.dark.generalBackground}66,
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

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
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
}

export type ProjectProps = ProjectContainerProps & { project: Project };

export const ProjectCard: FC<ProjectProps> = ({
  reverse,
  project
}) => (
  <ProjectContainer
    $reverse={reverse}
    variants={cardVariants}
    whileHover="hover"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <ProjectImageContainer>
      <ProjectImage
        width={500}
        height={500}
        alt={project.name}
        src={project.image}
        style={{
            width: '100%',
            height: 'auto',
            maxWidth: '500px'
        }}
      />
    </ProjectImageContainer>
    <ProjectContentContainer>
      <GlassmorphismBackground>
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
      </GlassmorphismBackground>
    </ProjectContentContainer>
  </ProjectContainer>
);
