import { ParagraphTitleWithIcon } from "chicio-blog";
import { FaGamepad, FaLightbulb } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";
import { BiPlug, BiTerminal, BiWrench } from "react-icons/bi";

export const Default = () => (
    <h2>
        <ParagraphTitleWithIcon icon={<FaGamepad className="text-shadow-lg" />}>Gameplay</ParagraphTitleWithIcon>
    </h2>
);

export const SubSectionTitle = () => (
    <h3>
        <ParagraphTitleWithIcon icon={<BiTerminal className="text-accent text-xl" />}>
            Claude Code
        </ParagraphTitleWithIcon>
    </h3>
);

export const VideogamesSectionTitles = () => (
    <div className="flex flex-col">
        <h2>
            <ParagraphTitleWithIcon icon={<FiCpu className="text-shadow-lg" />}>Hardware specs</ParagraphTitleWithIcon>
        </h2>
        <h2>
            <ParagraphTitleWithIcon icon={<FaLightbulb className="text-shadow-lg" />}>
                Trivia & Fun Facts
            </ParagraphTitleWithIcon>
        </h2>
    </div>
);

export const McpSectionTitles = () => (
    <div className="flex flex-col">
        <h2>
            <ParagraphTitleWithIcon icon={<BiWrench className="text-accent" />}>Available Tools</ParagraphTitleWithIcon>
        </h2>
        <h2>
            <ParagraphTitleWithIcon icon={<BiPlug className="text-accent text-2xl" />}>
                Connect Your AI Assistant
            </ParagraphTitleWithIcon>
        </h2>
    </div>
);
