import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-external-with-tracking";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { Project } from "@/content/home/projects";
import { Variants } from "framer-motion";
import { FC } from "react";

export type ProjectProps = { project: Project };

export const ProjectCard: FC<ProjectProps> = ({ project }) => (
  <div className="mx-auto w-full"  >
    <div className="glow-container p-4 md:p-8 flex flex-col gap-5 md:mx-auto md:my-5 md:flex-row">
      <div className="flex flex-1 flex-col">
        <h3 className="mb-3">{project.name}</h3>
        <p>{project.description}</p>
        <ul>
          {project.features.map((feature) => (
            <li key={`${project.name}${feature}`}>{feature}</li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-4">
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
        </div>
      </div>
      <div className="relative mt-4 flex flex-1 items-center justify-center self-stretch overflow-hidden p-0 md:mt-0 md:p-7">
        <ImageGlow
          className="relative h-auto w-full max-w-[500px] object-cover md:h-[100%] md:w-auto md:max-w-full"
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
      </div>
    </div>
  </div>
);
