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

const ProjectImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  //padding: ${(props) => props.theme.spacing[4]};
  
  ${mediaQuery.minWidth.md} {
    min-height: 400px;
    padding: ${(props) => props.theme.spacing[6]};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 65, 0.05) 0%,
      rgba(0, 255, 65, 0.02) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ProjectImage = styled(Image)`
  ${borderRadius};
  position: relative;
  z-index: 2;
  box-shadow: 
    0 8px 32px rgba(0, 255, 65, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 255, 65, 0.2);
  
  &:hover {
    transform: scale(1.03) translateY(-4px);
    box-shadow: 
      0 0 32px rgba(0, 255, 65, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 255, 65, 0.4);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 255, 65, 0.1) 0%,
      rgba(0, 255, 65, 0.05) 50%,
      transparent 70%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border-radius: inherit;
  }

  &:hover::after {
    opacity: 1;
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
  }
};

export type ProjectProps = ProjectContainerProps & { project: Project };

export const ProjectCard: FC<ProjectProps> = ({
  reverse,
  project
}) => (
  <ProjectContainer
    $reverse={reverse}
    variants={cardVariants}
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
