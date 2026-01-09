import { FC } from "react";

interface Props {
  videoId: string;
}

export const Youtube: FC<Props> = ({ videoId }) => 
  <iframe src={`https://www.youtube.com/embed/${videoId}`} title="React Native multiple debugger" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>