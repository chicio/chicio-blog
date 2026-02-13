import { BiCart } from "react-icons/bi";
import { IoGameControllerOutline } from "react-icons/io5";
import { FC } from "react";
import { TbDeviceGamepad2 } from "react-icons/tb";
import { ReleaseYear } from "./release-year";
import { InfoPill } from "./info-pill";

interface ConsoleTimeInformationProps {
  releaseYear?: string;
  acquiredYear?: string;
  bits?: string;
  generation?: string;
  className?: string;
}

export const ConsoleTimeInformation: FC<ConsoleTimeInformationProps> = ({
  releaseYear,
  acquiredYear,
  bits,
  generation,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-2 md:flex-row ${className}`}>
      {releaseYear && <ReleaseYear releaseYear={releaseYear} />}
      {acquiredYear && (
        <InfoPill icon={<BiCart />} label="Acquired" value={acquiredYear} />
      )}
      {bits && (
        <InfoPill
          icon={<IoGameControllerOutline />}
          label="Architecture"
          value={bits}
        />
      )}
      {generation && (
        <InfoPill
          icon={<TbDeviceGamepad2 />}
          label="Generation"
          value={generation}
        />
      )}
    </div>
  );
};
