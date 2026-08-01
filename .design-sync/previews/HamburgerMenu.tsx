import { HamburgerMenu } from "chicio-blog";

// HamburgerMenu is a bare icon that paints in currentColor, so the colour comes
// from whatever bar it is dropped into — the previews below supply both.
const openMobileMenu = () => {};

export const Default = () => (
    <div className="flex text-primary-text">
        <HamburgerMenu onClick={openMobileMenu} />
    </div>
);

export const Accent = () => (
    <div className="flex text-accent">
        <HamburgerMenu onClick={openMobileMenu} />
    </div>
);

// How it actually sits on the site: the trailing control of the mobile menu bar,
// beside the command-palette search trigger.
export const InMenuBar = () => (
    <div className="glassmorphism-lite-no-scale flex min-h-16 items-center gap-4 px-4">
        <span className="font-mono text-sm text-accent">chicio coding</span>
        <div className="flex text-primary-text">
            <HamburgerMenu onClick={openMobileMenu} />
        </div>
    </div>
);
