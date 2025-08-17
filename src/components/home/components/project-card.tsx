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

const ProjectGlassContainer = styled(GlassmorphismBackground)`
  // padding: ${(props) => props.theme.spacing[6]};
  // height: fit-content;
  //
  // ${mediaQuery.minWidth.md} {
  //   padding: ${(props) => props.theme.spacing[8]};
  // }
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
  
  ${mediaQuery.minWidth.md} {
    min-height: 400px;
  }
`;

const ProjectImage = styled(Image)`
  ${borderRadius};
  box-shadow: 0 8px 32px rgba(0, 255, 65, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 48px rgba(0, 255, 65, 0.2);
  }
`;

const ProjectTitle = styled(Heading4)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
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
      <ProjectGlassContainer>
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
      </ProjectGlassContainer>
    </ProjectContentContainer>
  </ProjectContainer>
);
