import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
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
            <InternalLink to={url}>
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
            </InternalLink>
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
