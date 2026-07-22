import { BiTerminal } from "react-icons/bi";
import { RoundedIcon } from "@/components/design-system/atoms/icons/rounded-icon";

export const TerminalIcon = () => (
    <RoundedIcon className="animate-pulse flex items-center justify-center text-text-above-primary">
        <BiTerminal className="size-5 md:size-7" title="terminal navigation" />
    </RoundedIcon>
);
