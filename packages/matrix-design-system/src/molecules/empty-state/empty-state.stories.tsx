import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoBookOutline, IoGameControllerOutline } from "react-icons/io5";
import { EmptyState } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Empty State",
    component: EmptyState,
};

export default meta;

type Story = StoryObj;

const NoGamesStory = () => <EmptyState icon={<IoGameControllerOutline />} subject="games" query="zelda" />;

const NoMangaStory = () => <EmptyState icon={<IoBookOutline />} subject="manga" query="berserk" />;

export const NoGames: Story = { render: () => <NoGamesStory /> };
export const NoManga: Story = { render: () => <NoMangaStory /> };
