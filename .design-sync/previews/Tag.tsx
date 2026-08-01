import { Tag } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <Tag tag="typescript" link="/blog/tag/typescript/" big={false} onClick={() => {}} />
    </div>
);

export const Big = () => (
    <div className="flex">
        <Tag tag="web development" link="/blog/tag/web-development/" big={true} onClick={() => {}} />
    </div>
);

export const PostTagRow = () => (
    <div className="flex flex-wrap">
        <Tag tag="ai" link="/blog/tag/ai/" big={false} />
        <Tag tag="mcp" link="/blog/tag/mcp/" big={false} />
        <Tag tag="typescript" link="/blog/tag/typescript/" big={false} />
        <Tag tag="web development" link="/blog/tag/web-development/" big={false} />
        <Tag tag="nextjs" link="/blog/tag/nextjs/" big={false} />
    </div>
);

export const BigTagCloud = () => (
    <div className="flex flex-wrap">
        <Tag tag="swift" link="/blog/tag/swift/" big={true} />
        <Tag tag="kotlin" link="/blog/tag/kotlin/" big={true} />
        <Tag tag="react native" link="/blog/tag/react-native/" big={true} />
    </div>
);
