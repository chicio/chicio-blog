import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { FC } from "react";
import { ManufacturerLogo } from "@/components/content/videogames/manufacturer-logo";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";

interface ConsoleLogosProps {
    manufacturer: string;
    manufacturerLogo: string;
    logo: string;
    url?: string;
}

export const ConsoleLogos: FC<ConsoleLogosProps> = ({ manufacturer, manufacturerLogo, logo, url }) => (
    <>
        {url ? (
            <StandardInternalLinkWithTracking to={url}>
                <div className="flex items-center gap-2">
                    <ManufacturerLogo logoUrl={manufacturerLogo} name={manufacturer} />
                    <ImageGlow
                        src={logo}
                        alt={`console logo`}
                        width={100}
                        height={56}
                        className="mb-6 h-14 bg-black object-contain p-2"
                    />
                </div>
            </StandardInternalLinkWithTracking>
        ) : (
            <div className="flex items-center gap-2">
                <ManufacturerLogo logoUrl={manufacturerLogo} name={manufacturer} />
                <ImageGlow
                    src={logo}
                    alt={`console logo`}
                    width={100}
                    height={56}
                    className="mb-6 h-14 bg-black object-contain p-2"
                />
            </div>
        )}
    </>
);
