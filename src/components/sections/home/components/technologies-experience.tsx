import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { FC } from "react";
import { SectionTitle } from "./section-title";

export const TechnologiesExperience: FC<{ author: string }> = ({ author }) => (
  <div className="mb-9">
    <SectionTitle>Tech Stack & Expertise</SectionTitle>
    <GlassmorphismBackground>
      <p className='text-shadow-md text-center max-w-[800px] my-9 mx-auto'>
        {`I'm ${author}, Experienced Senior Software Engineer with 15+ years in mobile and web development. Passionate about building performant, scalable applications used by millions of users 🚀.`}
      </p>
      <p className='text-shadow-md text-center max-w-[800px] my-9 mx-auto'>
        {`
  My expertise spans mobile app development, clean architecture, event-driven systems, and full-stack development (Spring Boot, React/React Native, Kubernetes). I’m an OSS contributor and I share technical insights regularly on my blog.`}
      </p>
    </GlassmorphismBackground>
  </div>
);
