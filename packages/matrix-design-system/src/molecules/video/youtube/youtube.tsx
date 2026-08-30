import { FC } from "react";

interface Props {
    videoId: string;
    title?: string;
}

export const Youtube: FC<Props> = ({ videoId, title = "YouTube video" }) => (
    <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
    />
);
