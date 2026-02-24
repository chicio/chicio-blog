import { GameFormat } from "@/types/content/videogames";
import { FC } from "react";
import { BsDisc } from "react-icons/bs";
import { BsCloud } from "react-icons/bs";

const icons = {
    [GameFormat.Physical]: <BsCloud />,
    [GameFormat.Digital]: <BsDisc />
}

interface GameFormatIconProps {
    format?: GameFormat
}

export const GameFormatIcon: FC<GameFormatIconProps> = ({ format }) => {
    return <>{format? icons[format] : null}</>
}