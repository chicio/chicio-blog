import styled from "styled-components";
import { CallToActionInternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-internal-with-tracking";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";

const CTAContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing[4]};
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]};
`;

export const ProfileCTAs = () => (
  <CTAContainer>
    <CallToActionInternalWithTracking
      trackingData={{
        action: tracking.action.open_blog,
        category: tracking.category.home,
        label: tracking.label.body,
      }}
      to={slugs.blog}
    >
      Blog
    </CallToActionInternalWithTracking>
    <CallToActionInternalWithTracking
      trackingData={{
        action: tracking.action.open_art,
        category: tracking.category.home,
        label: tracking.label.body,
      }}
      to={slugs.art}
    >
      Art
    </CallToActionInternalWithTracking>
  </CTAContainer>
);
