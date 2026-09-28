import { FC } from "react";
import { BiCalendar } from "react-icons/bi";
import {
    FaBook,
    FaBuilding,
    FaFlagCheckered,
    FaLanguage,
    FaLayerGroup,
    FaNewspaper,
    FaPaintBrush,
    FaPenNib,
    FaTags,
    FaUsers,
} from "react-icons/fa";
import { MdOutlineAutoStories } from "react-icons/md";
import { InfoPill } from "matrix-design-system";
import { serializationLabel, volumesOwnedLabel } from "@/lib/content/manga/manga-figures";
import { MangaMetadata } from "@/types/content/manga";

interface MangaInformationProps {
    metadata: MangaMetadata;
    className?: string;
}

export const MangaInformation: FC<MangaInformationProps> = ({ metadata, className }) => (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
        <InfoPill icon={<FaPenNib />} label="Story by" value={metadata.storyBy.join(", ")} />
        <InfoPill icon={<FaPaintBrush />} label="Art by" value={metadata.artBy.join(", ")} />
        <InfoPill icon={<FaBuilding />} label="Original publisher" value={metadata.originalPublisher} />
        <InfoPill icon={<FaNewspaper />} label="Magazine" value={metadata.magazine} />
        <InfoPill icon={<BiCalendar />} label="Serialization" value={serializationLabel(metadata)} />
        <InfoPill icon={<FaUsers />} label="Demographic" value={metadata.demographic} />
        <InfoPill icon={<FaTags />} label="Genres" value={metadata.genres.join(", ")} />
        <InfoPill icon={<FaFlagCheckered />} label="Status" value={metadata.status} />
        <InfoPill icon={<FaBook />} label="Edition" value={metadata.edition} />
        <InfoPill icon={<MdOutlineAutoStories />} label="Edition publisher" value={metadata.editionPublisher} />
        <InfoPill icon={<FaLanguage />} label="Language" value={metadata.language} />
        <InfoPill icon={<FaLayerGroup />} label="Volumes owned" value={volumesOwnedLabel(metadata)} />
        <InfoPill icon={<BiCalendar />} label="Acquired" value={metadata.acquiredYear} />
    </div>
);
