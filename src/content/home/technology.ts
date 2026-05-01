import { StaticImageData } from "next/image";
import reactImage from "../about-me/images/technologies/react.png";
import expoImage from "../about-me/images/technologies/expo.png";
import appleImage from "../about-me/images/technologies/apple.png";
import androidImage from "../about-me/images/technologies/android.png";
import nextImage from "../about-me/images/technologies/next.png";
import gatsbyImage from "../about-me/images/technologies/gatsby.png";
import springBootImage from "../about-me/images/technologies/spring-boot.png";
import kubernetesImage from "../about-me/images/technologies/kubernetes.png";
import dockerImage from "../about-me/images/technologies/docker.png";
import grafanaImage from "../about-me/images/technologies/grafana.png";
import swiftImage from "../about-me/images/technologies/swift.png";
import typescriptImage from "../about-me/images/technologies/typescript.png";
import javascriptImage from "../about-me/images/technologies/javascript.png";
import kotlinImage from "../about-me/images/technologies/kotlin.png";
import javaImage from "../about-me/images/technologies/java.png";
import objectiveC from "../about-me/images/technologies/objective-c.png";

export const categories = {
  mobile: 'Mobile Development',
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  languages: 'Programming languages'
} as const;

export type CategoryType = typeof categories[keyof typeof categories];

export interface Technology {
  name: string;
  image: StaticImageData;
  years: string;
  category: CategoryType;
}

export const technologies: Technology[] = [
  { name: 'React Native', image: reactImage, years: '8+ years', category: categories.mobile },
  { name: 'Expo', image: expoImage, years: '1+ years', category: categories.mobile },
  { name: 'iOS', image: appleImage, years: '15+ years', category: categories.mobile },
  { name: 'Android', image: androidImage, years: '8+ years', category: categories.mobile },
  { name: 'React', image: reactImage, years: '8+ years', category: categories.frontend },
  { name: 'Next.js', image: nextImage, years: '1+ years', category: categories.frontend },
  { name: 'Expo', image: expoImage, years: '1+ years', category: categories.frontend },
  { name: 'Gatsby', image: gatsbyImage, years: '5+ years', category: categories.frontend },
  { name: 'Spring Boot', image: springBootImage, years: '5+ years', category: categories.backend },
  { name: 'Kubernetes', image: kubernetesImage, years: '5+ years', category: categories.backend },
  { name: 'Docker', image: dockerImage, years: '5+ years', category: categories.backend },
  { name: 'Grafana', image: grafanaImage, years: '5+ years', category: categories.backend },
  { name: 'Swift', image: swiftImage, years: '10+ years', category: categories.languages },
  { name: 'TypeScript', image: typescriptImage, years: '6+ years', category: categories.languages },
  { name: 'JavaScript', image: javascriptImage, years: '6+ years', category: categories.languages },
  { name: 'Kotlin', image: kotlinImage, years: '5+ years', category: categories.languages },
  { name: 'Java', image: javaImage, years: '15+ years', category: categories.languages },
  { name: 'Objective-C', image: objectiveC, years: '15+ years', category: categories.languages },
];
