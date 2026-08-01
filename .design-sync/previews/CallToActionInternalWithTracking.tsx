import { CallToActionInternalWithTracking } from "chicio-blog";
import { BiEnvelope } from "react-icons/bi";

export const Default = () => (
    <div className="flex">
        <CallToActionInternalWithTracking to="/blog" onClick={() => {}}>
            Go to the blog
        </CallToActionInternalWithTracking>
    </div>
);

export const IconOnly = () => (
    <div className="flex">
        <CallToActionInternalWithTracking to="/contact" onClick={() => {}} className="min-w-auto!">
            <BiEnvelope size={30} />
        </CallToActionInternalWithTracking>
    </div>
);

export const NavigationRow = () => (
    <div className="flex flex-wrap gap-4">
        <CallToActionInternalWithTracking to="/data-structures-and-algorithms/roadmap">
            DSA roadmap
        </CallToActionInternalWithTracking>
        <CallToActionInternalWithTracking to="/chat" prefetch>
            Chat with my AI
        </CallToActionInternalWithTracking>
    </div>
);
