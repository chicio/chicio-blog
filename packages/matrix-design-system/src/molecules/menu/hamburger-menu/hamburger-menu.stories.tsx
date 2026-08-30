import type { Meta, StoryObj } from "@storybook/react-vite";
import { HamburgerMenu } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Menu/Hamburger Menu",
    component: HamburgerMenu,
};

export default meta;

type Story = StoryObj;

// HamburgerMenu is a bare icon that paints in currentColor, so the colour comes
// from whatever bar it is dropped into — the previews below supply both.
const openMobileMenu = () => {};

const DefaultStory = () => (
    <div className="text-primary-text flex">
        <HamburgerMenu onClick={openMobileMenu} />
    </div>
);

const AccentStory = () => (
    <div className="text-accent flex">
        <HamburgerMenu onClick={openMobileMenu} />
    </div>
);

// How it actually sits on the site: the trailing control of the mobile menu bar,
// beside the command-palette search trigger.
const InMenuBarStory = () => (
    <div className="glassmorphism-lite-no-scale flex min-h-16 items-center gap-4 px-4">
        <span className="text-accent font-mono text-sm">chicio coding</span>
        <div className="text-primary-text flex">
            <HamburgerMenu onClick={openMobileMenu} />
        </div>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const Accent: Story = { render: () => <AccentStory /> };
export const InMenuBar: Story = { render: () => <InMenuBarStory /> };
