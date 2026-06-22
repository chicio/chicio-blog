import { TrackingData } from "@/types/configuration/tracking";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { Cursor } from "@/components/design-system/atoms/typography/terminal-blocks";
import { Button } from "@/components/design-system/atoms/buttons/button";
import React from "react";

export const TerminalLink: React.FC<{
    to: string;
    trackingData: TrackingData;
    label: string;
    className?: string;
}> = ({ to, trackingData, label, className }) => (
    <Button className={`w-fit${className ? ` ${className}` : ""}`}>
        <StandardInternalLinkWithTracking
            to={to}
            trackingData={trackingData}
            className="font-mono text-lg no-underline hover:no-underline"
        >
            <span className="text-shadow-sm">
                {">"} {label}
                <Cursor />
            </span>
        </StandardInternalLinkWithTracking>
    </Button>
);
