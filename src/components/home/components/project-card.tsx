import {FC} from "react";
import styled, {TransientProps} from "styled-components";
import {Container} from "@/components/design-system/atoms/container";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {borderRadius} from "@/components/design-system/atoms/border-radius";
import {Paragraph} from "@/components/design-system/atoms/paragraph";
import {List} from "@/components/design-system/atoms/list";
import {CallToActionExternalWithTracking} from "@/components/design-system/atoms/call-to-action-external-with-tracking";
import Image from 'next/image';
import {Project} from "@/types/projects";
import {Heading4} from "@/components/design-system/atoms/heading4";

interface ProjectContainerProps {
  reverse: boolean;
}

const ProjectContainer = styled(Container)<TransientProps<ProjectContainerProps>>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.theme.spacing[7]} auto;
    gap: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.md} {
    flex-direction: ${(props) => (props.$reverse ? "row-reverse" : "row")};
    gap: ${(props) => props.theme.spacing[10]};
  }
`;

const ProjectContentContainer = styled.div`
  flex: 50%;
  //padding: ${(props) => props.theme.spacing[2]};
`;

const ProjectImageContainer = styled(ProjectContentContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ProjectImage = styled(Image)`
    ${borderRadius};
    box-shadow: 0 3px 10px 0 ${(props) => props.theme.light.boxShadowLight};

    ${mediaQuery.dark} {
        box-shadow: 0 3px 10px 0 ${(props) => props.theme.dark.boxShadowLight};
    }
`

const CallToActionContainer = styled.div`
  margin: ${(props) => props.theme.spacing[6]} 0;
`;

export type ProjectProps = ProjectContainerProps & { project: Project };

export const ProjectCard: FC<ProjectProps> = ({
  reverse,
  project
}) => (
  <ProjectContainer $reverse={reverse}>
    <ProjectImageContainer>
      <ProjectImage
        width={500}
        height={500}
        alt={project.name}
        src={project.image}
        style={{
            width: '100%',
            height: 'auto',
        }}
      />
    </ProjectImageContainer>
    <ProjectContentContainer>
      <Heading4>{project.name}</Heading4>
      <Paragraph>{project.description}</Paragraph>
      <List className="project-features">
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
  </ProjectContainer>
);
