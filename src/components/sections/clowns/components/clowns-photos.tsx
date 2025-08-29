/* eslint-disable @next/next/no-img-element */
"use client";

import styled from "styled-components";
import { useShuffleArray } from "@/components/design-system/utils/hooks/use-shuffle-array";
import { ClownsPageTemplate } from "./clowns-page-template";

const PhotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ClownsPhotos = () => {
  const photos = useShuffleArray([
    'https://media.cnn.com/api/v1/images/stellar/prod/141013132117-clowns-world-clowning-association-march-2014.jpg?q=x_0,y_222,h_2402,w_4271,c_crop/h_833,w_1480',
    'https://s.marketwatch.com/public/resources/images/MW-DS208_clowns_MG_20150813230255.jpg',
    'https://compote.slate.com/images/08fff2b1-ecae-48e0-a350-2bdf792091db.jpg?crop=4928%2C3280%2Cx0%2Cy0',
    'https://previews.123rf.com/images/ginosphotos/ginosphotos1009/ginosphotos100900544/7794212-group-of-clowns-posing-isolated-over-a-white-background.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/Scary_Clowns_at_PDC2008_Party_at_Universal_Studios_%28cropped%29.jpg',
    'https://www.floridatoday.com/gcdn/authoring/authoring-images/2023/08/23/PBRE/70658565007-clown-convention-61.JPG?crop=5175,2923,x0,y0&width=3200&height=1808&format=pjpg&auto=webp',
    'https://c8.alamy.com/comp/GAXFDF/glastonbury-festival-2008-day-two-a-group-revellers-dressed-up-as-GAXFDF.jpg',
    'https://i.pinimg.com/736x/ec/de/9d/ecde9de299622f9de706a2f31a702b56.jpg',
    'https://live.staticflickr.com/650/32731041796_00cb91ec4e_b.jpg',
  ], 4);

  return (
    <ClownsPageTemplate>
        {photos.map((photo, index) => (
          <PhotoWrapper key={index}>
            <img src={photo} alt={`Clown Photo ${index + 1}`} />
          </PhotoWrapper>
        ))}
    </ClownsPageTemplate>
  );
};
