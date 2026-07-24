import { FC } from "react";

const DEFAULT_VIDEO_CLASS_NAME =
    "aspect-video w-full rounded-xl border border-solid border-accent-alpha-40 shadow-lg";

interface Props {
    src: string;
    poster?: string;
    caption?: string;
    autoPlay?: boolean;
    onEnded?: () => void;
    videoRef?: (el: HTMLVideoElement | null) => void;
    ariaLabel?: string;
    className?: string;
}

export const SelfHostedVideo: FC<Props> = ({
    src,
    poster,
    caption,
    autoPlay,
    onEnded,
    videoRef,
    ariaLabel,
    className,
}) => {
    const sourceSrc = poster || src.includes("#") ? src : `${src}#t=0.1`;
    return (
        <figure className="my-4">
            <video
                ref={videoRef}
                controls
                preload="metadata"
                playsInline
                autoPlay={autoPlay}
                onEnded={onEnded}
                poster={poster}
                aria-label={ariaLabel}
                className={className ?? DEFAULT_VIDEO_CLASS_NAME}
            >
                <source src={sourceSrc} />
                Your browser does not support the video tag.{" "}
                <a href={src}>Download the video</a>.
            </video>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    );
};
