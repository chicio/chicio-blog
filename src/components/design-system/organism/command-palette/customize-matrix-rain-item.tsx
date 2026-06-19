import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { Command } from "cmdk";
import { TerminalLine } from "../../atoms/typography/terminal-blocks";
import { useWebGpuSupported } from "@/components/design-system/hooks/use-webgpu-supported";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { openMatrixRainPanel } from "@/lib/command-palette/command-palette-events";
import { MdTune } from "react-icons/md";

interface CustomizeMatrixRainItemProps {
    onClose: () => void;
}

export const CustomizeMatrixRainItem = ({ onClose }: CustomizeMatrixRainItemProps) => {
    const webGpuSupported = useWebGpuSupported();
    const reducedMotion = useReducedMotions();

    const visible = webGpuSupported === true && !reducedMotion;

    if (!visible) {
        return null;
    }

    const handleSelect = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_matrix_rain_panel,
        });
        onClose();
        openMatrixRainPanel();
    };

    return (
        <Command.Item
            value="customize matrix rain"
            className="px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100"
            onSelect={handleSelect}
        >
            <TerminalLine>
                <MdTune className="inline mr-2 mb-0.5" />
                {">"} Customize Matrix Rain
            </TerminalLine>
        </Command.Item>
    );
};
