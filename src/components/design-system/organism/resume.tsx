'use client'

import { FC, useState } from "react";
import { ContainerFluid } from "../atoms/container-fluid";
import styled from "styled-components";
import { Tabs } from "../molecules/tabs";
import { Projects } from "./projects";
import { Timeline } from "./timeline";
import { mediaQuery } from "../utils-css/media-query";
import { tracking } from "@/types/tracking";

const ResumeContainer = styled(ContainerFluid)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[8]};
  background: ${(props) => props.theme.dark.generalBackground};
  scroll-snap-align: start;
  position: relative;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[12]};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

enum TabContent {
  projects = "projects",
  carrier = "carrier",
}

export const Resume: FC = () => {
  const [currentTab, setTab] = useState<TabContent>(TabContent.projects);

  return (
    <ResumeContainer>
      <ContentWrapper>
        <Tabs
          tab1={{
            active: currentTab === TabContent.projects,
            label: "Open Source",
            link: "#personal-projects",
            trackingAction: tracking.action.open_personal_projects_tab,
            trackingCategory: tracking.category.home,
            trackingLabel: tracking.label.body,
            action: () => setTab(TabContent.projects),
          }}
          tab2={{
            active: currentTab === TabContent.carrier,
            label: "Experience",
            link: "#experience",
            trackingAction: tracking.action.open_education_and_experiences_tab,
            trackingCategory: tracking.category.home,
            trackingLabel: tracking.label.body,
            action: () => setTab(TabContent.carrier),
          }}
        />
        <div>
          {currentTab === TabContent.projects && <Projects />}
          {currentTab === TabContent.carrier && <Timeline />}
        </div>
      </ContentWrapper>
    </ResumeContainer>
  );
};
