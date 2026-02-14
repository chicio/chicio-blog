import { IoGameControllerOutline } from "react-icons/io5";
import { FC } from "react";
import { ReleaseYear } from "./release-year";
import { InfoPill } from "./info-pill";
import { MdOutlineDeveloperBoard } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { GiVibratingShield } from "react-icons/gi";
import { GiGameConsole } from "react-icons/gi";
import { MdOutlinePlace } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";

interface GameInformationProps {
  className?: string;
  releaseYear?: string;
  acquiredYear?: string;
  developer?: string;
  publisher?: string;
  genre?: string;
  pegiRating?: string;
  region?: string;
  console?: string;
}

export const GameInformation: FC<GameInformationProps> = ({
  className,
  releaseYear,
  acquiredYear,
  developer,
  publisher,
  genre,
  pegiRating,
  region,
  console,
}) => {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
      {releaseYear && <ReleaseYear releaseYear={releaseYear} />}
      {acquiredYear &&   <InfoPill icon={<BiCalendar />} label="Acquired" value={acquiredYear} />}
      {developer && (
        <InfoPill icon={<MdOutlineDeveloperBoard />} label="Developer" value={developer} />
      )}
      {publisher && (
        <InfoPill icon={<IoNewspaperOutline />} label="Publisher" value={publisher} />
      )}
      {genre && (
        <InfoPill icon={<IoGameControllerOutline />} label="Genre" value={genre} />
      )}
      {pegiRating && (
        <InfoPill icon={<GiVibratingShield />} label="PEGI Rating" value={pegiRating} />
      )}
      {region && (
        <InfoPill icon={<MdOutlinePlace />} label="Region" value={region} />
      )}
      {console && (
        <InfoPill icon={<GiGameConsole />} label="Console" value={console} />
      )}
    </div>
  );
};
