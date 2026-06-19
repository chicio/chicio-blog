import { trackWith } from "@/lib/tracking/tracking";
import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";
import { writeMotion } from "@/lib/motion/motion";
import { Command } from "cmdk";
import { TerminalLine } from "../../atoms/typography/terminal-blocks";
import { tracking } from "@/types/configuration/tracking";
import { MdDoDisturb, MdAnimation } from "react-icons/md";

export const ToggleMotionItem = () => {
    const motionEnabled = useMotionStore();

    const handleToggleMotion = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_toggle_motion,
        });
        writeMotion(motionEnabled ? "off" : "on");
    };

    return (
        <Command.Item value="toggle animations motion" className={"px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100"} onSelect={handleToggleMotion}>
            <TerminalLine>
                {motionEnabled ? (
                    <MdDoDisturb className="inline mr-2 mb-0.5" />
                ) : (
                    <MdAnimation className="inline mr-2 mb-0.5" />
                )}
                {">"} Toggle Animations{" "}
                <span className="ml-1 text-accent/60 font-mono text-xs">
                    [{motionEnabled ? "ON" : "OFF"}]
                </span>
            </TerminalLine>
        </Command.Item>
    );
};
