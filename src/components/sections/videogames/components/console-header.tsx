import { FC } from "react";
import { ConsoleLogos } from "./console-logos";

interface ConsoleHeaderProps {
  name: string;
  manufacturer: string;
  manufacturerLogo: string;
  logo: string;
  url?: string;
}

export const ConsoleHeader: FC<ConsoleHeaderProps> = ({
  name,
  manufacturer,
  manufacturerLogo,
  logo,
  url,
}) => (
  <>
    <h1>{name}</h1>
    <ConsoleLogos
      manufacturer={manufacturer}
      manufacturerLogo={manufacturerLogo}
      logo={logo}
      url={url}
    />
  </>
);
