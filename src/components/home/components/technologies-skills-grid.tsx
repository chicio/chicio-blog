import { TechnologyCard } from "@/components/home/components/technology-card";
import { FC } from "react";
import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { motion } from "framer-motion";
import { useTechnologies } from "@/components/home/hooks/useTechnologies";

const SkillsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[8]};
  margin-top: ${(props) => props.theme.spacing[8]};
  width: 100%;

  ${mediaQuery.minWidth.md} {
    gap: ${(props) => props.theme.spacing[12]};
  }
`;

const SkillCategory = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    align-items: center;
  }
`;

const CategoryTitle = styled(motion.h3)`
  color: ${(props) => props.theme.dark.accentColor};
  font-size: ${(props) => props.theme.fontSizes[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  text-align: center;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[5]};
    margin-bottom: ${(props) => props.theme.spacing[6]};
  }
`;

const TechnologiesGrid = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[6]};
  margin: 0 auto;
`;

export const TechnologiesSkillsGrid: FC = () => {
  const { technologies } = useTechnologies();

  return (
    <SkillsGrid>
      {Object.entries(technologies).map(([category, techs]) => (
        <SkillCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <TechnologiesGrid>
            {techs.map((tech, index) => (
              <TechnologyCard tech={tech} index={index} key={tech.name} />
            ))}
          </TechnologiesGrid>
        </SkillCategory>
      ))}
    </SkillsGrid>
  );
};
