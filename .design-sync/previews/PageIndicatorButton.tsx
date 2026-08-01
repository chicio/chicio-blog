import { PageIndicatorButton } from "chicio-blog";

const noop = () => {};

const indices = [0, 1, 2, 3, 4];

export const Default = () => (
    <div className="flex">
        <div className="bg-general-background-light flex gap-2 rounded-full p-3">
            {indices.map((index) => (
                <PageIndicatorButton key={index} index={index} isActive={index === 2} onSelect={noop} />
            ))}
        </div>
    </div>
);

export const FirstSlideSelected = () => (
    <div className="flex">
        <div className="bg-general-background-light flex gap-2 rounded-full p-3">
            {indices.map((index) => (
                <PageIndicatorButton key={index} index={index} isActive={index === 0} onSelect={noop} />
            ))}
        </div>
    </div>
);

export const ActiveNextToInactive = () => (
    <div className="flex">
        <div className="bg-general-background-light flex gap-4 rounded-full px-5 py-4">
            <PageIndicatorButton index={0} isActive onSelect={noop} />
            <PageIndicatorButton index={1} isActive={false} onSelect={noop} />
        </div>
    </div>
);
