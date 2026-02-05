import { StaticImageData } from "next/image";
import lastminuteImage from "../../../public/images/carrier/lastminute-group.png";
import unimibImage from "../../../public/images/carrier/unimib.jpg";
import condenastImage from "../../../public/images/carrier/condenast.png";
import shiImage from "../../../public/images/carrier/shi.png";
import bottinelliImage from "../../../public/images/carrier/bottinelli-informatica.png";
import avanadeImage from "../../../public/images/carrier/avanade.png";
import insubriaImage from "../../../public/images/carrier/insubria.png";

export interface TimelineItemData {
  id: string;
  type: 'work' | 'education';
  title: string;
  subtitle: string;
  date: string;
  description: string;
  features?: string[];
  link?: string;
  image: StaticImageData;
}

export const timelineData: TimelineItemData[] = [
  {
    id: 'lastminute',
    type: 'work',
    title: 'Lastminute.com group',
    subtitle: 'Mobile application developer',
    date: 'February 2017',
    description: 'Designing and implementing iOS and Android apps for the main brands of the company:',
    features: ['lastminute.com', 'Volagratis', 'Rumbo', 'Weg.de'],
    link: 'https://lmgroup.lastminute.com/',
    image: lastminuteImage
  },
  {
    id: 'unimib',
    type: 'education',
    title: 'Milano-Bicocca University',
    subtitle: "Master's degree in Computer Science",
    date: 'July 2016',
    description: 'Thesis: "Spectral Clara Lux Tracer: physically based ray tracer with multiple shading models support". You can find more info about it in the project section.',
    features: ['Computer graphics', 'Software engineering', 'Algorithm and Theoretical CS', 'IT security', 'IT management', 'Design and user experience'],
    link: 'https://www.disco.unimib.it/it',
    image: unimibImage
  },
  {
    id: 'condenast',
    type: 'work',
    title: 'Condé Nast Italia',
    subtitle: 'Mobile/Web application developer',
    date: 'June 2013',
    description: 'Designing and implementing iOS and Android apps for the main brands of the company: Vanity Fair, Glamour, Wired, Vogue. I also worked with the web team to develop the new version of the official web sites for GQ Italia, Glamour, CNLive! and Vogue Italia.',
    link: 'https://www.condenast.it',
    image: condenastImage
  },
  {
    id: 'shi',
    type: 'work',
    title: 'SHI',
    subtitle: 'iOS/Web Developer',
    date: 'October 2010',
    description: 'Design and development of mobile application on iOS, Android and Windows phone platform, for enterprise distribution (ad-hoc distribution) or within the various app store. Design and development of Web application used as backend for mobile app. Design and development of Enterprise Web application.',
    link: 'https://www.linkedin.com/company/shi-srl/?originalSubdomain=it',
    image: shiImage
  },
  {
    id: 'bottinelli',
    type: 'work',
    title: 'Bottinelli informatica',
    subtitle: 'Developer',
    date: 'August 2009',
    description: 'Software development for textile industry.',
    link: '#',
    image: bottinelliImage
  },
  {
    id: 'avanade',
    type: 'work',
    title: 'Avanade',
    subtitle: 'PMO Consultant',
    date: 'October 2008',
    description: 'Assigned on Eurosig integration BA-HVB/Unicredit project, I worked with the Accenture Consultant team as a PMO.',
    features: [
      'Tracking creation and evolution of functional specification to cover the gaps between ASC, CRE, PAY, MDM and BSS sector of the IT systems of Unicredit and HVB bank.',
      'Publishing statistics to show the state of art of the functional specification produced, the open change request and the state of user test. Maintenance of tools created with Microsoft Excel, Microsoft Powerpoint and VBA used to generate the above mentioned statistics.',
      'Maintenance of tools used to manage WBS of the project inside Accenture team.'
    ],
    link: 'https://www.avanade.com',
    image: avanadeImage
  },
  {
    id: 'insubria',
    type: 'education',
    title: 'Insubria University',
    subtitle: "Bachelor's degree in Computer Science",
    date: 'October 2008',
    description: 'Thesis: "Grandi Giardini: implementazione di un portale web con funzionalità e-commerce". A web e-commerce developed for Grandi Giardini Italiani s.r.l., a company dealing with the organization of events in some of the most beautiful italian gardens (never deployed in production).',
    features: ['Software engineering', 'Algorithm and Theoretical CS', 'IT security', 'IT management', 'Networking', 'Programming'],
    link: 'https://www.uninsubria.it',
    image: insubriaImage
  }
];
