import { Command } from "cmdk";
import { CustomizeMatrixRainItem } from "chicio-blog";
import { FC, PropsWithChildren } from "react";

// cmdk auto-highlights the first item of a list, so the resting (unselected) row style is only
// reachable by driving the root with a controlled value that matches no item.
const NOTHING_SELECTED = "no-item-selected";

const PaletteList: FC<PropsWithChildren<{ selected?: string }>> = ({ children, selected }) => (
    <div className="glassmorphism-lite-no-scale w-full max-w-150 overflow-hidden">
        <Command shouldFilter={false} className="flex flex-col" value={selected}>
            <Command.List className="py-2">
                <Command.Group>
                    <div className="text-accent/50 px-4 py-1 font-mono text-xs tracking-wider uppercase">
                        Quick Actions
                    </div>
                    {children}
                </Command.Group>
            </Command.List>
        </Command>
    </div>
);

export const Default = () => (
    <PaletteList selected={NOTHING_SELECTED}>
        <CustomizeMatrixRainItem onClose={() => {}} />
    </PaletteList>
);

export const Selected = () => (
    <PaletteList selected="customize matrix rain">
        <CustomizeMatrixRainItem onClose={() => {}} />
    </PaletteList>
);

export const InQuickActions = () => (
    <PaletteList selected="customize matrix rain">
        <Command.Item
            value="open ai chat"
            className="aria-selected:bg-accent-alpha-10 aria-selected:border-accent cursor-pointer px-4 py-2 transition-colors duration-100 aria-selected:border-l-2"
            onSelect={() => {}}
        >
            <span className="text-accent font-mono text-sm text-shadow-md">{"> Open chat"}</span>
        </Command.Item>
        <CustomizeMatrixRainItem onClose={() => {}} />
    </PaletteList>
);
