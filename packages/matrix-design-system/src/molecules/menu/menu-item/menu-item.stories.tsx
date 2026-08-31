import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuItem } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Menu/Menu Item",
    component: MenuItem,
};

export default meta;

type Story = StoryObj;

// Single instances are wrapped in a flex row: MenuItem is a block-level link and
// stretches to the full card width otherwise, which hides its pill shape.
const DefaultStory = () => (
    <div className="flex">
        <MenuItem to="/blog" selected={false}>
            Blog
        </MenuItem>
    </div>
);

const SelectedStory = () => (
    <div className="flex">
        <MenuItem to="/data-structures-and-algorithms/roadmap" selected>
            Roadmap
        </MenuItem>
    </div>
);

const ExternalStory = () => (
    <div className="flex">
        <MenuItem to="https://chicio.github.io/chicio-blog/matrix-rain/" selected={false} external>
            Matrix Rain
        </MenuItem>
    </div>
);

const NavigationRowStory = () => (
    <div className="flex flex-wrap gap-2">
        <MenuItem to="/" selected={false}>
            Home
        </MenuItem>
        <MenuItem to="/blog" selected>
            Blog
        </MenuItem>
        <MenuItem to="/about-me" selected={false}>
            About me
        </MenuItem>
        <MenuItem to="/videogames" selected={false}>
            Videogames
        </MenuItem>
        <MenuItem to="/art" selected={false}>
            Art
        </MenuItem>
        <MenuItem to="/contact" selected={false}>
            Contact me
        </MenuItem>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const Selected: Story = { render: () => <SelectedStory /> };
export const External: Story = { render: () => <ExternalStory /> };
export const NavigationRow: Story = { render: () => <NavigationRowStory /> };
