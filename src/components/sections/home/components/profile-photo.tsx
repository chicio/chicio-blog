import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC } from "react";
import { ImageGlow } from "@/components/design-system/atoms/image-glow";

const ProfilePhotoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImageGlow = styled(ImageGlow)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  
  img {
    border-radius: 50%;
    object-fit: cover;
  }

  ${mediaQuery.minWidth.md} {
    width: 200px;
    height: 200px;
  }
`;

export const ProfilePhoto: FC<{ author: string }> = ({ author }) => (
  <ProfilePhotoContainer>
    <StyledImageGlow
      src="/images/authors/fabrizio-duroni.jpg"
      alt={author}
      width={200}
      height={200}
      priority
    />
  </ProfilePhotoContainer>
);
