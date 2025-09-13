import { CallToActionInternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-internal-with-tracking";
import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";

export const ProfileCTAs = () => (
  <div className="flex justify-center mt-7 gap-5">
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
  </div>
);
