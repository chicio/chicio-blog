import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoverCardBadge } from "../cover-card-badge";
import { landscapeImage, portraitImage } from "../../../stories/sample-media";
import { CoverCard } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Cover Card",
    component: CoverCard,
};

export default meta;

type Story = StoryObj;

const LinkWithBadgeStory = () => (
    <div className="w-80">
        <CoverCard
            src={portraitImage}
            title="Demon Slayer: Kimetsu no Yaiba"
            action={{ kind: "link", href: "/manga/demon-slayer" }}
            badges={<CoverCardBadge>23/23 ✓</CoverCardBadge>}
        />
    </div>
);

const LinkWithoutBadgeStory = () => (
    <div className="w-80">
        <CoverCard src={portraitImage} title="Death Note" action={{ kind: "link", href: "/manga/death-note" }} />
    </div>
);

// A landscape cover shows why the card paints a blurred copy behind the contained image: the
// letterboxed bands are filled with the cover's own colours instead of empty space.
const LandscapeCoverStory = () => (
    <div className="w-80">
        <CoverCard src={landscapeImage} title="The Legend of Zelda" action={{ kind: "link", href: "/videogames" }} />
    </div>
);

// The art gallery uses the same card; the click opens the lightbox instead of navigating.
const LightboxStory = () => (
    <div className="w-80">
        <CoverCard src={portraitImage} title="Jellyfish 🪼" action={{ kind: "lightbox" }} />
    </div>
);

const GridStory = () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        <CoverCard
            src={portraitImage}
            title="Demon Slayer: Kimetsu no Yaiba"
            action={{ kind: "link", href: "/manga/demon-slayer" }}
            badges={<CoverCardBadge>23/23 ✓</CoverCardBadge>}
        />
        <CoverCard
            src={portraitImage}
            title="Death Note"
            action={{ kind: "link", href: "/manga/death-note" }}
            badges={<CoverCardBadge>1/1 ✓</CoverCardBadge>}
        />
    </div>
);

export const LinkWithBadge: Story = { render: () => <LinkWithBadgeStory /> };
export const LinkWithoutBadge: Story = { render: () => <LinkWithoutBadgeStory /> };
export const LandscapeCover: Story = { render: () => <LandscapeCoverStory /> };
export const Lightbox: Story = { render: () => <LightboxStory /> };
export const Grid: Story = { render: () => <GridStory /> };
