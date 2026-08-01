import { Button } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <Button onClick={() => {}}>Read the full article</Button>
    </div>
);

export const WithIcon = () => (
    <div className="flex">
        <Button className="my-2 flex items-center gap-4" onClick={() => {}} type="button">
            <div className="flex-shrink-0">💬</div>
            <span className="text-primary-text flex-1 text-sm leading-normal">
                What did you work on at lastminute.com?
            </span>
        </Button>
    </div>
);

export const ActionRow = () => (
    <div className="flex flex-wrap gap-3">
        <Button onClick={() => {}}>
            <p>TL;DR</p>
        </Button>
        <Button onClick={() => {}}>
            <p>Key Points</p>
        </Button>
    </div>
);
