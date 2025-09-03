import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { Paragraph } from "@/components/design-system/atoms/typography/paragraph";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { FC } from "react";

export const ArtHeader: FC = () => (
  <div className="mt-12">
    <GlassmorphismBackground>
      <PageTitle>Art</PageTitle>
      <Paragraph>
        {` My love for everything that is related to visual 👨‍🎨 art/science 👨‍🔬 (tattoo, computer graphics etc.) took me to create this page. A collection of all the draws I created while I'm learning to draw. Keep it in your bookmark to see my drawing skills evolution 🎨 (or follow me on instagram ❤️)`}
      </Paragraph>
    </GlassmorphismBackground>
  </div>
);
