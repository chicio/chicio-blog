'use client'

import styled from "styled-components";
import { FC } from "react";
import Image from "next/image";
import {ContainerFluid} from "@/components/design-system/atoms/container-fluid";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {Paragraph} from "@/components/design-system/atoms/paragraph";
import {Container} from "@/components/design-system/atoms/container";
import typescriptImage from "../../../../public/images/technologies/typescript.png";
import reactImage from "../../../../public/images/technologies/react.png";
import xcodeImage from "../../../../public/images/technologies/xcode.png";
import swiftImage from "../../../../public/images/technologies/swift.png";
import androidImage from "../../../../public/images/technologies/android.png";

const TechnologiesContainer = styled(ContainerFluid)`
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[11]};
  background-color: ${(props) => props.theme.light.primaryColorDark};

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.primaryColorDark};
  }
`;

const TechnologyParagraph = styled(Paragraph)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[7]};
  color: ${(props) => props.theme.light.textAbovePrimaryColor};
  font-size: ${(props) => props.theme.fontSizes[3]};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  }

  ${mediaQuery.minWidth.md} {
    padding: 0 ${(props) => props.theme.spacing[12]};
  }
`;

const TechnologiesIconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const TechnologyImageContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: ${(props) => props.theme.spacing[2]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface TechnologiesProps {
  author: string;
}

export const Technologies: FC<TechnologiesProps> = ({ author }) => (
  <TechnologiesContainer>
    <Container>
      <TechnologyParagraph>
        {`I’m ${author}, a software developer with over 15 years of experience, working in the field since 2008. I specialise in developing mobile 📱 and web applications 🚀. I also maintain small open-source projects and I have a blog where I speak about technology.`}
      </TechnologyParagraph>
    </Container>
    <TechnologiesIconsContainer>
      <TechnologyImageContainer>
        <Image
          src={typescriptImage}
          alt={"typescript"}
          placeholder={"blur"}
          width={80}
          height={80}
        />
      </TechnologyImageContainer>
      <TechnologyImageContainer>
        <Image
          src={reactImage}
          alt={"react"}
          placeholder={"blur"}
          width={80}
          height={80}
        />
      </TechnologyImageContainer>
      <TechnologyImageContainer>
        <Image
          src={xcodeImage}
          alt={"xcode"}
          placeholder={"blur"}
          width={80}
          height={80}
        />
      </TechnologyImageContainer>
      <TechnologyImageContainer>
        <Image
          src={swiftImage}
          alt={"swift"}
          placeholder={"blur"}
          width={80}
          height={80}
        />
      </TechnologyImageContainer>
      <TechnologyImageContainer>
        <Image
          src={androidImage}
          alt={"android"}
          placeholder={"blur"}
          width={70}
          height={80}
        />
      </TechnologyImageContainer>
    </TechnologiesIconsContainer>
  </TechnologiesContainer>
);
