import { BiChevronDown } from "react-icons/bi";
import { RoundedIcon } from "./icon";

export const DownArrowIcon = () => (
  <RoundedIcon className="text-text-above-primary flex animate-bounce items-center justify-center hover:shadow-lg">
    <BiChevronDown
      className="size-7 md:size-9"
      title="Scroll to next section"
    />
  </RoundedIcon>
);
