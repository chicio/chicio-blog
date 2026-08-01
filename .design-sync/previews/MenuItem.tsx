import { MenuItem } from "chicio-blog";

// Single instances are wrapped in a flex row: MenuItem is a block-level link and
// stretches to the full card width otherwise, which hides its pill shape.
export const Default = () => (
    <div className="flex">
        <MenuItem to="/blog" selected={false}>
            Blog
        </MenuItem>
    </div>
);

export const Selected = () => (
    <div className="flex">
        <MenuItem to="/data-structures-and-algorithms/roadmap" selected>
            Roadmap
        </MenuItem>
    </div>
);

export const External = () => (
    <div className="flex">
        <MenuItem to="https://chicio.github.io/matrix-rain-webgpu/" selected={false} external>
            Matrix Rain
        </MenuItem>
    </div>
);

export const NavigationRow = () => (
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
