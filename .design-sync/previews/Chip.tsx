import { Chip } from "chicio-blog";

// Single instances are wrapped in a flex row: in a plain block context the chip stretches to the
// full card width and reads as a bar rather than a chip.
export const Default = () => (
    <div className="flex">
        <Chip>TypeScript</Chip>
    </div>
);

export const Big = () => (
    <div className="flex">
        <Chip big>Data structures and algorithms</Chip>
    </div>
);

export const TagRow = () => (
    <div className="flex flex-wrap gap-2">
        <Chip>Next.js</Chip>
        <Chip>React</Chip>
        <Chip>TailwindCSS</Chip>
        <Chip>Swift</Chip>
        <Chip>Kotlin</Chip>
    </div>
);
