import { Markdown } from "chicio-blog";

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

export const Default = () => (
    <div className="max-w-2xl">
        <Markdown content={graphTraversalArticle} id="graph-traversal" />
    </div>
);

export const ChatAnswer = () => (
    <div className="max-w-2xl">
        <Markdown content={chatAnswer} id="chat-answer" />
    </div>
);

export const ExerciseDescription = () => (
    <div className="max-w-2xl">
        <Markdown content={exerciseDescription} id="number-of-islands" />
    </div>
);
