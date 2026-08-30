import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Typography/Markdown",
    component: Markdown,
};

export default meta;

type Story = StoryObj;

const graphTraversalArticle = `## Graph traversal

Two traversals cover most of the graph problems you will meet in an interview. Both of them visit
every vertex once, so with an adjacency list the cost is \`O(V + E)\`.

- **BFS** explores the graph level by level using a queue, so it is the traversal that gives you the
  shortest path in an unweighted graph.
- **DFS** goes as deep as it can before backtracking, using an explicit stack or the call stack, and
  it is the natural fit for cycle detection and topological sort.

> Pick the traversal from the question, not from habit: "shortest" almost always means BFS.
`;

const chatAnswer = `I have written a few articles about **SwiftUI** on the blog:

- [Use SwiftUI Path and Shape to render your svg files](/blog) walks through drawing vector paths by
  hand.
- The Metal series covers the rendering pipeline underneath, from shaders to the depth buffer.

If you want the code, every example lives in a repository linked at the end of the post.
`;

const exerciseDescription = `### Number of Islands

Given an \`m x n\` binary grid where \`1\` is land and \`0\` is water, count the number of islands.

| Approach | Time | Space |
| --- | --- | --- |
| DFS flood fill | O(m · n) | O(m · n) |
| BFS flood fill | O(m · n) | O(min(m, n)) |
| Union find | O(m · n · α) | O(m · n) |

Flood fill every unvisited land cell and count how many times you had to start a new fill.
`;

const DefaultStory = () => (
    <div className="max-w-2xl">
        <Markdown content={graphTraversalArticle} id="graph-traversal" />
    </div>
);

const ChatAnswerStory = () => (
    <div className="max-w-2xl">
        <Markdown content={chatAnswer} id="chat-answer" />
    </div>
);

const ExerciseDescriptionStory = () => (
    <div className="max-w-2xl">
        <Markdown content={exerciseDescription} id="number-of-islands" />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const ChatAnswer: Story = { render: () => <ChatAnswerStory /> };
export const ExerciseDescription: Story = { render: () => <ExerciseDescriptionStory /> };
