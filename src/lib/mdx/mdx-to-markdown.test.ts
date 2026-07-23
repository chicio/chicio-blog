import { describe, it, expect } from "vitest";
import { mdxToMarkdown } from "./mdx-to-markdown";

describe("mdxToMarkdown", () => {
    it("strips import statements", () => {
        const mdx = `import { FaGamepad } from "react-icons/fa";
import { ImageCarousel } from "@/components/design-system/organism/image-carousel";

# Title

Some prose.
`;
        const result = mdxToMarkdown(mdx);

        expect(result).not.toContain("import");
        expect(result).toContain("# Title");
        expect(result).toContain("Some prose.");
    });

    it("strips export statements", () => {
        const mdx = `export const meta = { foo: "bar" };

# Title
`;
        const result = mdxToMarkdown(mdx);

        expect(result).not.toContain("export");
        expect(result).toContain("# Title");
    });

    it("strips JSX comment expressions", () => {
        const mdx = `# Title

{/* this is a comment, should be dropped */}

Some prose.
`;
        const result = mdxToMarkdown(mdx);

        expect(result).not.toContain("this is a comment");
        expect(result).toContain("Some prose.");
    });

    describe("ParagraphTitleWithIcon transform", () => {
        it("unwraps to plain heading text when nested inside a real markdown heading (real content shape)", () => {
            const mdx = `import { FaGamepad } from "react-icons/fa";
import { ParagraphTitleWithIcon } from "@/components/design-system/molecules/typography/paragraph-title-with-icon";

## <ParagraphTitleWithIcon icon={<FaGamepad className="text-shadow-lg" />}>Gameplay</ParagraphTitleWithIcon>

Some prose after the heading.
`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("## Gameplay");
            expect(result).not.toContain("ParagraphTitleWithIcon");
            expect(result).not.toContain("FaGamepad");
        });

        it("preserves the original heading depth (### case from real MCP content)", () => {
            const mdx = `import { ParagraphTitleWithIcon } from "@/components/design-system/molecules/typography/paragraph-title-with-icon";

### <ParagraphTitleWithIcon icon={<BiTerminal className="text-accent text-xl" />}>Claude Code</ParagraphTitleWithIcon>
`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("### Claude Code");
        });
    });

    describe("ImageCarousel transform", () => {
        it("expands each image to its own markdown image link, plus an italic caption line (real Batman game shape)", () => {
            const mdx = `import { ImageCarousel } from "@/components/design-system/organism/image-carousel";

<ImageCarousel
    images={[
        "/media/content/videogames/console/gameboy/game/batman/gameplay/1.jpg",
        "/media/content/videogames/console/gameboy/game/batman/gameplay/2.jpg",
        "/media/content/videogames/console/gameboy/game/batman/gameplay/3.jpg",
    ]}
    alt="Batman: the video game gameplay"
    caption="IGDB"
/>
`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("![Batman: the video game gameplay](/media/content/videogames/console/gameboy/game/batman/gameplay/1.jpg)");
            expect(result).toContain("![Batman: the video game gameplay](/media/content/videogames/console/gameboy/game/batman/gameplay/2.jpg)");
            expect(result).toContain("![Batman: the video game gameplay](/media/content/videogames/console/gameboy/game/batman/gameplay/3.jpg)");
            expect(result).toContain("*IGDB*");
            expect(result).not.toContain("ImageCarousel");
        });

        it("omits the caption line when no caption prop is given", () => {
            const mdx = `<ImageCarousel images={["/a.jpg"]} alt="alt text" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("![alt text](/a.jpg)");
            expect(result.trim().endsWith("![alt text](/a.jpg)")).toBe(true);
        });

        it("falls back to a placeholder when the images array cannot be resolved to string literals", () => {
            const mdx = `<ImageCarousel images={someDynamicValue} alt="alt" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: ImageCarousel — open the page]");
        });

        it("falls back to a placeholder when the images prop is not an array expression at all", () => {
            const mdx = `<ImageCarousel images="oops" alt="alt" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: ImageCarousel — open the page]");
        });

        it("emits inline image phrasing (no wrapping paragraph) when used inline within running text", () => {
            const mdx = `Some text <ImageCarousel images={["/a.jpg"]} alt="alt" caption="cap" /> more text.\n`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("Some text ![alt](/a.jpg)*cap* more text.");
        });
    });

    describe("Youtube transform", () => {
        it("converts a videoId prop into a watch link (real blog post shape)", () => {
            const mdx = `<Youtube videoId="Xxo3Q17Mkng" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[Watch on YouTube](https://youtu.be/Xxo3Q17Mkng)");
        });

        it("falls back to a placeholder when neither videoId nor url is present", () => {
            const mdx = `<Youtube />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: Youtube — open the page]");
        });

        it("falls back to a placeholder when videoId is a non-literal expression", () => {
            const mdx = `<Youtube videoId={someVar} />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: Youtube — open the page]");
        });
    });

    describe("interactive component placeholder", () => {
        it.each([
            "DynamicArrayVisualizer",
            "BacktrackingVisualizer",
            "KadaneVisualizer",
            "GraphPropertiesVisualizer",
            "StringVisualization",
            "StackVisualizer",
            "BitwiseVisualizer",
            "RecursiveCallStackVisualizer",
            "TreeTypesVisualizer",
            "MatrixTerminal",
            "FrequencyMapChart",
            "TechnologiesSkillsGrid",
            "Projects",
            "Timeline",
            "Topics",
            "TopicExercises",
            "ExercisesList",
            "CourseNavigation",
            "McpEndpoint",
        ])("replaces <%s /> with an 'open the page' placeholder", (componentName) => {
            const mdx = `<${componentName} />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain(`[interactive: ${componentName} — open the page]`);
            expect(result).not.toContain(`<${componentName}`);
        });

        it("keeps prop values out of the placeholder (real DSA topic shape)", () => {
            const mdx = `<TopicExercises topic="linked-list" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: TopicExercises — open the page]");
            expect(result).not.toContain("linked-list");
        });
    });

    describe("structural wrapper unwrap", () => {
        it("drops an InteractiveBlock wrapper and keeps (transformed) children (real DSA topic shape)", () => {
            const mdx = `<InteractiveBlock title="Dynamic Array Visualization">
  <DynamicArrayVisualizer />
</InteractiveBlock>
`;
            const result = mdxToMarkdown(mdx);

            expect(result).not.toContain("InteractiveBlock");
            expect(result).not.toContain("Dynamic Array Visualization");
            expect(result).toContain("[interactive: DynamicArrayVisualizer — open the page]");
        });

        it("unwraps an unknown component that wraps real markdown prose", () => {
            const mdx = `<SomeUnknownWrapper>

This is a paragraph of real prose that should survive.

</SomeUnknownWrapper>
`;
            const result = mdxToMarkdown(mdx);

            expect(result).not.toContain("SomeUnknownWrapper");
            expect(result).toContain("This is a paragraph of real prose that should survive.");
        });
    });

    describe("unknown component fallback", () => {
        it("placeholders an unknown self-closing component by its own name", () => {
            const mdx = `<TotallyUnknownWidget foo="bar" />`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: TotallyUnknownWidget — open the page]");
            expect(result).not.toContain("TotallyUnknownWidget />");
        });
    });

    describe("plain markdown passthrough", () => {
        it("leaves headings, lists, links, blockquotes, and code fences (incl. mermaid) unchanged in structure", () => {
            const mdx = `# Sort Colors

Leetcode Problem 75: [Sort Colors](https://leetcode.com/problems/sort-colors/description/)

## Techniques
- Array
- Two Pointers

> a blockquote

\`\`\`ts
function sortColors(nums: number[]): void {
    console.log(nums);
}
\`\`\`

\`\`\`mermaid
graph LR
    A --> B
\`\`\`
`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("# Sort Colors");
            expect(result).toContain("[Sort Colors](https://leetcode.com/problems/sort-colors/description/)");
            expect(result).toContain("- Array");
            expect(result).toContain("- Two Pointers");
            expect(result).toContain("> a blockquote");
            expect(result).toContain("```ts");
            expect(result).toContain("```mermaid");
            expect(result).toContain("graph LR");
        });
    });

    describe("edge cases", () => {
        it("handles a component nested inside another component's children", () => {
            const mdx = `<InteractiveBlock title="Wrapper">
    <ImageCarousel images={["/a.jpg"]} alt="nested" />
</InteractiveBlock>
`;
            const result = mdxToMarkdown(mdx);

            expect(result).toContain("![nested](/a.jpg)");
            expect(result).not.toContain("InteractiveBlock");
            expect(result).not.toContain("ImageCarousel");
        });

        it("handles a self-closing unknown component with an expression prop without throwing", () => {
            const mdx = `<KadaneVisualizer nums={[1, -2, 3, 5, -1, 2]}/>`;

            expect(() => mdxToMarkdown(mdx)).not.toThrow();

            const result = mdxToMarkdown(mdx);

            expect(result).toContain("[interactive: KadaneVisualizer — open the page]");
            expect(result).not.toContain("nums=");
        });

        it("strips a bare JS expression used at flow level", () => {
            const mdx = `# Title

{someExpression}

Prose after.
`;
            const result = mdxToMarkdown(mdx);

            expect(result).not.toContain("someExpression");
            expect(result).toContain("Prose after.");
        });

        it("does not choke on LaTeX braces inside a math block (real reflection-vector post shape)", () => {
            const mdx = `Some prose before.

$$
{\\hat {R}} \\cdot {\\hat {N}} = {\\hat {L}} \\cdot {\\hat {N}}
$$

Some prose after.
`;

            expect(() => mdxToMarkdown(mdx)).not.toThrow();

            const result = mdxToMarkdown(mdx);

            expect(result).toContain("Some prose before.");
            expect(result).toContain("Some prose after.");
            expect(result).toContain("{\\hat {R}} \\cdot {\\hat {N}} = {\\hat {L}} \\cdot {\\hat {N}}");
        });
    });
});
