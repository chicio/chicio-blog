import type { Meta, StoryObj } from "@storybook/react-vite";
import { MotionDiv } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Animation/Motion Div",
    component: MotionDiv,
};

export default meta;

type Story = StoryObj;

// initial={false} renders the element straight at its `animate` state. Mount transitions cannot be
// captured in a still frame anyway, and under the screenshot harness they are frozen mid-flight, so
// an `initial={{ opacity: 0 }}` entrance photographs as an empty card.

const DefaultStory = () => (
    <div className="flex">
        <MotionDiv
            className="glow-container max-w-md p-5"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <h3 className="text-accent mt-0 mb-2">Matrix Rain WebGPU</h3>
            <p className="text-primary-text m-0">
                GPU-accelerated Matrix-style digital rain for React, built with WebGPU and TypeGPU.
            </p>
        </MotionDiv>
    </div>
);

const StaggeredStackStory = () => (
    <div className="flex max-w-md flex-col gap-3">
        <MotionDiv
            className="glow-container p-4"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
            <span className="text-primary-text font-mono">React Native Skia Skeleton</span>
        </MotionDiv>
        <MotionDiv
            className="glow-container p-4"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
        >
            <span className="text-primary-text font-mono">Matrix Rain WebGPU</span>
        </MotionDiv>
        <MotionDiv
            className="glow-container p-4"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
        >
            <span className="text-primary-text font-mono">Chicio Coding blog</span>
        </MotionDiv>
    </div>
);

const AnimatedBarStory = () => (
    <div className="flex w-full max-w-md flex-col gap-2">
        <div className="flex items-center justify-between">
            <span className="text-primary-text font-mono text-sm">Reading progress</span>
            <span className="text-accent font-mono text-sm">72%</span>
        </div>
        <div className="bg-general-background-light border-accent-alpha-25 h-8 w-full overflow-hidden rounded-full border">
            <MotionDiv
                className="bg-accent h-full rounded-full"
                initial={false}
                animate={{ width: "72%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            />
        </div>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const StaggeredStack: Story = { render: () => <StaggeredStackStory /> };
export const AnimatedBar: Story = { render: () => <AnimatedBarStory /> };
