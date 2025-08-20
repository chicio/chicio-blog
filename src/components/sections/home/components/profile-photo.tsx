import Image from "next/image";
import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC } from "react";

const ProfilePhotoContainer = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto ${(props) => props.theme.spacing[6]} auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.dark.boxShadowLight};

  img {
    width: 97%;
    height: 97%;
    border-radius: 50%;
    object-fit: cover;
  }

  ${mediaQuery.minWidth.md} {
    width: 200px;
    height: 200px;
  }

  &:hover {
    background: ${(props) => props.theme.dark.accentColor};
    box-shadow: 0 0 20px ${(props) => props.theme.dark.accentColor}90;
  }
`;

export const ProfilePhoto: FC<{ author: string }> = ({ author }) => (
  <ProfilePhotoContainer>
    <Image
      src="/images/authors/fabrizio-duroni.jpg"
      alt={author}
      width={200}
      height={200}
      priority
    />
  </ProfilePhotoContainer>
);
