import reactImage from "../../../../public/images/technologies/react.png";
import expoImage from "../../../../public/images/technologies/expo.png";
import appleImage from "../../../../public/images/technologies/apple.png";
import androidImage from "../../../../public/images/technologies/android.png";
import nextImage from "../../../../public/images/technologies/next.png";
import gatsbyImage from "../../../../public/images/technologies/gatsby.png";
import springBootImage from "../../../../public/images/technologies/spring-boot.png";
import kubernetesImage from "../../../../public/images/technologies/kubernetes.png";
import dockerImage from "../../../../public/images/technologies/docker.png";
import grafanaImage from "../../../../public/images/technologies/grafana.png";
import swiftImage from "../../../../public/images/technologies/swift.png";
import typescriptImage from "../../../../public/images/technologies/typescript.png";
import javascriptImage from "../../../../public/images/technologies/javascript.png";
import kotlinImage from "../../../../public/images/technologies/kotlin.png";
import javaImage from "../../../../public/images/technologies/java.png";
import objectiveC from "../../../../public/images/technologies/objective-c.png";
import { categories, Technology } from "@/types/technology";

const technologies: Technology[] = [
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

export const useTechnologies = () => {
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return {
    technologies: groupedTechnologies,
  }
}
