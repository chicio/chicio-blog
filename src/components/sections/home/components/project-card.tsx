import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-external-with-tracking";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { Project } from "@/types/projects";
import { motion, Variants } from "framer-motion";
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
          <h3 className="mb-3">{project.name}</h3>
          <p>{project.description}</p>
          <ul>
            {project.features.map((feature) => (
              <li key={`${project.name}${feature}`}>{feature}</li>
            ))}
          </ul>
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
          <ImageGlow
            className="relative object-cover w-full h-auto max-w-[500px] md:h-[100%] md:w-auto md:max-w-full"
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