import { FC } from "react";
import { ConsoleLogo } from "./console-logo";

interface ConsoleHeaderProps {
  name: string;
  manufacturer: string;
  manufacturerLogo: string;
}

export const ConsoleHeader: FC<ConsoleHeaderProps> = ({
  name,
  manufacturer,
  manufacturerLogo,
}) => (
  <>
    <h1>{name}</h1>
    <ConsoleLogo logoUrl={manufacturerLogo} name={manufacturer} />
  </>
);
