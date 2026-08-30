import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentProgressBar } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Organism/Reading Content Progress Bar",
    component: ContentProgressBar,
};

export default meta;

type Story = StoryObj;

// ContentProgressBar is a position:fixed strip that docks under the header while you read. Two
// things have to be arranged for a static card to show it:
//
//  - It reads reading progress from the element whose id is `contentId` (window.scrollY minus that
//    element's offsetTop, over its scrollHeight). Each cell therefore renders a real article
//    element with that id, offset upwards so the hook resolves a genuine mid-article percentage
//    instead of the 0% a never-scrolled page reports.
//  - Until the reader scrolls down it parks itself at translateY(-100px), above the fold. The
//    wrapper's +100px transform both scopes the fixed strip to this card and cancels that park
//    offset, so the capture shows the docked state the reader actually sees.

//  - The terminal line it wraps ends in a blinking Cursor whose keyframes spend half their cycle at
//    opacity 0, and the capture lands in that half; freezing the animation at frame 0 keeps the
//    cursor in the shot without changing anything else.

const dockBar = { transform: "translateY(100px)" };

const readingFixture = (top: string, height: string) => ({ top, height });

const FreezeBlink = () => <style>{".ds-blink-still .animate-blink{animation-play-state:paused}"}</style>;

const DefaultStory = () => (
    <div className="ds-blink-still relative h-32 w-full overflow-hidden">
        <FreezeBlink />
        <div style={dockBar}>
            <ContentProgressBar contentId="blog-post-content" />
        </div>
        <article id="blog-post-content" className="absolute w-full" style={readingFixture("-1200px", "3000px")} />
    </div>
);

const NearlyFinishedStory = () => (
    <div className="ds-blink-still relative h-32 w-full overflow-hidden">
        <FreezeBlink />
        <div style={dockBar}>
            <ContentProgressBar contentId="dsa-topic-content" />
        </div>
        <article id="dsa-topic-content" className="absolute w-full" style={readingFixture("-2250px", "3000px")} />
    </div>
);

const JustStartedStory = () => (
    <div className="ds-blink-still relative h-32 w-full overflow-hidden">
        <FreezeBlink />
        <div style={dockBar}>
            <ContentProgressBar contentId="about-me-content" />
        </div>
        <article id="about-me-content" className="absolute w-full" style={readingFixture("-150px", "3000px")} />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const NearlyFinished: Story = { render: () => <NearlyFinishedStory /> };
export const JustStarted: Story = { render: () => <JustStartedStory /> };
