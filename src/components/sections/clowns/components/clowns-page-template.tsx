import { MediaGrid } from "@/components/sections/clowns/components/media-grid";
import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { GenericHeader } from "@/components/design-system/organism/header/generic-header";
import { PageTemplate } from "@/components/design-system/templates/page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";

import { ClownSvgIcon } from "@/components/sections/clowns/components/clown-svg-icon";
import { FC, PropsWithChildren } from "react";

export const ClownsPageTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PageTemplate
      header={
        <>
          <MatrixHeaderBackground big={false} />
          <GenericHeader
            title="Clownified!!!"
            subtitle="Bravo! Keep up the effort and you’ll clown-it!"
            logo={<ClownSvgIcon />}
          />
        </>
      }
      author={siteMetadata.author}
      trackingCategory={tracking.category.clowns}
    >
      <MediaGrid>
        {children}
      </MediaGrid>
    </PageTemplate>
  );
};
