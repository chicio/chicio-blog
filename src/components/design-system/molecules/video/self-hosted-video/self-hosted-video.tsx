import { FC } from "react";

interface Props {
    src: string;
    poster?: string;
    caption?: string;
}

export const SelfHostedVideo: FC<Props> = ({ src, poster, caption }) => {
    const sourceSrc = poster || src.includes("#") ? src : `${src}#t=0.1`;
    return (
        <figure className="my-4">
            <video
                controls
                preload="metadata"
                playsInline
                poster={poster}
                className="aspect-video w-full rounded-xl border border-solid border-accent-alpha-40 shadow-lg"
            >
                <source src={sourceSrc} />
                Your browser does not support the video tag.{" "}
                <a href={src}>Download the video</a>.
            </video>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    );
};
