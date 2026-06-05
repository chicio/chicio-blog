import { FC } from "react";

interface Props {
    src: string;
    poster?: string;
    caption?: string;
}

export const SelfHostedVideo: FC<Props> = ({ src, poster, caption }) => (
    <figure className="my-4">
        <video
            controls
            preload="metadata"
            playsInline
            poster={poster}
            className="aspect-video w-full rounded-xl border border-solid border-accent-alpha-40 shadow-lg"
        >
            <source src={src} />
        </video>
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
);
