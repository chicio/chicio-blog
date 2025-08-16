'use client'

import styled from "styled-components";
import { FC } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ContainerFluid } from "@/components/design-system/atoms/container-fluid";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";
import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";
import typescriptImage from "../../../../public/images/technologies/typescript.png";
import reactImage from "../../../../public/images/technologies/react.png";
import xcodeImage from "../../../../public/images/technologies/xcode.png";
import swiftImage from "../../../../public/images/technologies/swift.png";
import androidImage from "../../../../public/images/technologies/android.png";

const TechnologiesContainer = styled(ContainerFluid)`
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: ${(props) => props.theme.dark.generalBackground};
  scroll-snap-align: start;
  padding: ${(props) => props.theme.spacing[8]};

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[12]};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[10]};
  z-index: 2;
`;

const SectionTitle = styled(motion.div)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`;

const GradientTitle = styled(Paragraph)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.dark.accentColor},
    ${(props) => props.theme.dark.primaryColor}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${(props) => props.theme.fontSizes[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[6]};
  }
`;

const TechnologyParagraph = styled(Paragraph)`
  text-align: center;
  color: ${(props) => props.theme.dark.primaryTextColor};
  font-size: ${(props) => props.theme.fontSizes[3]};
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${(props) => props.theme.spacing[6]};
  margin-top: ${(props) => props.theme.spacing[8]};
`;

const SkillCategory = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategoryTitle = styled(motion.h3)`
  color: ${(props) => props.theme.dark.accentColor};
  font-size: ${(props) => props.theme.fontSizes[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  text-align: center;
`;

const TechnologiesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${(props) => props.theme.spacing[4]};
  width: 100%;
`;

const TechnologyCard = styled(motion.div)`
  background: rgba(0, 17, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  border-radius: 12px;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.dark.accentColor};
    box-shadow: 0 0 20px ${(props) => props.theme.dark.accentColor}40;
    transform: translateY(-2px);
  }
`;

const TechnologyImageContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const TechnologyName = styled.span`
  color: ${(props) => props.theme.dark.primaryTextColor};
  font-size: ${(props) => props.theme.fontSizes[1]};
  text-align: center;
  font-weight: 500;
`;

const ExperienceYears = styled.span`
  color: ${(props) => props.theme.dark.accentColor};
  font-size: ${(props) => props.theme.fontSizes[0]};
  margin-top: ${(props) => props.theme.spacing[1]};
`;

interface Technology {
  name: string;
  image: any;
  years: string;
  category: 'mobile' | 'web' | 'backend';
}

const technologies: Technology[] = [
  { name: 'Swift', image: swiftImage, years: '10+ years', category: 'mobile' },
  { name: 'Xcode', image: xcodeImage, years: '10+ years', category: 'mobile' },
  { name: 'Android', image: androidImage, years: '8+ years', category: 'mobile' },
  { name: 'React Native', image: reactImage, years: '8+ years', category: 'mobile' },
  { name: 'TypeScript', image: typescriptImage, years: '6+ years', category: 'web' },
  { name: 'React', image: reactImage, years: '8+ years', category: 'web' },
];

const categoryTitles = {
  mobile: 'Mobile Development',
  web: 'Web Development',
  backend: 'Backend & Tools'
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, type: "spring", stiffness: 100 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export interface TechnologiesProps {
  author: string;
}

export const Technologies: FC<TechnologiesProps> = ({ author }) => {
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <TechnologiesContainer>
      <ContentWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionTitle variants={itemVariants}>
            <GradientTitle as="h2">
              Tech Stack & Expertise
            </GradientTitle>
            <GlassmorphismBackground>
              <TechnologyParagraph variants={itemVariants}>
                {`I'm ${author}, a software developer with over 15 years of experience, working in the field since 2008. I specialise in developing mobile 📱 and web applications 🚀. I also maintain small open-source projects and I have a blog where I speak about technology.`}
              </TechnologyParagraph>
            </GlassmorphismBackground>
          </SectionTitle>

          <SkillsGrid variants={itemVariants}>
            {Object.entries(groupedTechnologies).map(([category, techs]) => (
              <SkillCategory key={category} variants={itemVariants}>
                <CategoryTitle variants={itemVariants}>
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </CategoryTitle>
                <TechnologiesGrid>
                  {techs.map((tech, index) => (
                    <TechnologyCard
                      key={tech.name}
                      variants={cardVariants}
                      whileHover="hover"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TechnologyImageContainer>
                        <Image
                          src={tech.image}
                          alt={tech.name}
                          placeholder="blur"
                          width={60}
                          height={60}
                        />
                      </TechnologyImageContainer>
                      <TechnologyName>{tech.name}</TechnologyName>
                      <ExperienceYears>{tech.years}</ExperienceYears>
                    </TechnologyCard>
                  ))}
                </TechnologiesGrid>
              </SkillCategory>
            ))}
          </SkillsGrid>
        </motion.div>
      </ContentWrapper>

      <FloatingDownArrow />
    </TechnologiesContainer>
  );
};
