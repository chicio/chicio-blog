import { BiChat } from "react-icons/bi";
import { RoundedIcon } from "../rounded-icon";

export const ChatIcon = () => (
    <RoundedIcon className="text-text-above-primary flex animate-pulse items-center justify-center">
        <BiChat className="size-5 md:size-7" aria-hidden="true" />
    </RoundedIcon>
);
