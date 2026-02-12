import { TrackingData } from "@/types/configuration/tracking";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";
import { Cursor } from "../../atoms/typography/terminal-blocks";

export const TerminalLink: React.FC<{
    to: string;
    trackingData: TrackingData;
    label: string;
}> = ({ to, trackingData, label }) => {
    return (
        <StandardInternalLinkWithTracking
            to={to}
            trackingData={trackingData}
            className={`font-mono text-lg`}
        >
            <span className="text-shadow-sm">
                {"> "} {label} <Cursor />
            </span>
        </StandardInternalLinkWithTracking>
    );
}