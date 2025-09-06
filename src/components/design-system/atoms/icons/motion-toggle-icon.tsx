import { MdAnimation, MdDoDisturb } from "react-icons/md";
import { RoundedIcon } from "./icon";

export const MotionOffIcon = () => (
  <RoundedIcon className="flex items-center justify-center text-text-above-primary">
    <MdDoDisturb className="size-5 md:size-7" title="Animazioni disattivate" />
  </RoundedIcon>
);

export const MotionOnIcon = () => (
  <RoundedIcon className="flex items-center justify-center text-text-above-primary">
    <MdAnimation className="size-5 md:size-7" title="Animazioni attivate" />
  </RoundedIcon>
);
