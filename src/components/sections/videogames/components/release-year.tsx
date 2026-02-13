import { FC } from "react";
import { BiCalendar } from "react-icons/bi";
import { InfoPill } from "./info-pill";

export const ReleaseYear: FC<{ releaseYear: string }> = ({ releaseYear }) => (
  <InfoPill icon={<BiCalendar />} label="Released" value={releaseYear} />
);
