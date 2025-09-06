import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC, useState } from "react";
import styled from "styled-components";

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[1]};

  ${mediaQuery.maxWidth.sm} {
    gap: ${(props) => props.theme.spacing[1]};
    margin-bottom: ${(props) => props.theme.spacing[0]};
  }
`;

export interface ChatHeaderProps {
  title: string;
  subtitle: string;
  logo: React.ReactElement; 
  visible?: boolean;
}

export const GenericHeader: FC<ChatHeaderProps> = ({ title, subtitle, logo, visible = true }) => {
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(false);

  const toggleSubtitle = () => {
    setIsSubtitleExpanded(!isSubtitleExpanded);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="glassmorphism text-center px-3 py-3 sm:px-5 sm:py-4 my-4 sm:my-7 mx-0" onClick={toggleSubtitle}>
      <TitleGroup>
        {logo}
        <h3>{title}</h3>
      </TitleGroup>
      <p className='text-shadow-md text-center text-sm sm:text-base'>
        {subtitle}
      </p>
    </div>
  );
};
