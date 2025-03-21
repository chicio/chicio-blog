import { Paragraph } from "../atoms/paragraph";
import { List } from "../atoms/list";
import { FC, ReactElement, ReactNode } from "react";
import styled, {css, TransientProps} from "styled-components";
import { Container } from "../atoms/container";
import { Heading6 } from "../atoms/heading6";
import { mediaQuery } from "../utils-css/media-query";
import { Time } from "../atoms/time";
import { Briefcase } from "@styled-icons/boxicons-regular";
import { GraduationCap } from "@styled-icons/fa-solid";
import {StandardExternalLinkWithTracking} from "@/components/design-system/atoms/standard-external-link-with-tracking";
import {tracking} from "@/types/tracking";
import Image from "next/image";
import lastminuteImage from "../../../../public/images/carrier/lastminute-group.png"
import unimibImage from "../../../../public/images/carrier/unimib.jpg"
import avanadeImage from "../../../../public/images/carrier/avanade.png"
import bottinelliImage from "../../../../public/images/carrier/bottinelli-informatica.png"
import condenastImage from "../../../../public/images/carrier/condenast.png"
import insubriaImage from "../../../../public/images/carrier/insubria.png"
import shiImage from "../../../../public/images/carrier/shi.png"

const TimelineContentContainer = styled(Container)`
  padding: 0;
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;

const TimelineContainer = styled.ul`
  list-style: none;
  padding: ${(props) => props.theme.spacing[4]} 0
    ${(props) => props.theme.spacing[4]};
  position: relative;
  text-align: justify;
  margin: 0;
  background-color: ${(props) => props.theme.light.generalBackground};

  ${mediaQuery.minWidth.md} {
    text-align: left;

    &:before {
      top: 0;
      bottom: 0;
      position: absolute;
      content: " ";
      width: 3px;
      left: 50%;
      margin-left: -1.5px;
      background-color: ${(props) => props.theme.light.dividerColor};
    }
  }

  ${mediaQuery.maxWidth.md} {
    &:before {
      left: 40px;
    }
  }

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.generalBackground};

    &:before {
      background-color: ${(props) => props.theme.dark.dividerColor};
    }
  }
`;

const TimelineElementContainer = styled.li`
  padding-bottom: ${(props) => props.theme.spacing[4]};
  position: relative;

  &:before,
  &:after {
    content: " ";
    display: table;
  }

  &:after {
    clear: both;
  }
`;

interface TimelinePanelProps {
  inverted: boolean;
}

const TimelinePanel = styled.div<TransientProps<TimelinePanelProps>>`
  background-color: ${(props) => props.theme.light.generalBackgroundLight};
  border: ${(props) => props.theme.light.dividerColor} 1px solid;
  box-shadow: ${(props) => props.theme.light.boxShadowLight} 0 1px 6px;
  width: 100%;
  float: left;
  border-radius: 3px;
  position: relative;

  ${mediaQuery.minWidth.md} {
    &:before {
      position: absolute;
      top: 26px;
      right: -15px;
      display: inline-block;
      border-top: 15px solid transparent;
      border-left: ${(props) => props.theme.light.dividerColor} 14px solid;
      border-right: ${(props) => props.theme.light.dividerColor} 0px solid;
      border-bottom: 15px solid transparent;
      content: " ";
    }

    &:after {
      position: absolute;
      top: 27px;
      right: -14px;
      display: inline-block;
      border-left: ${(props) => props.theme.light.generalBackgroundLight} 14px
        solid;
      border-right: ${(props) => props.theme.light.generalBackgroundLight} 0px
        solid;
      border-top: 14px solid transparent;
      border-bottom: 14px solid transparent;
      content: " ";
    }
  }

  ${mediaQuery.minWidth.md} {
    width: 46%;
  }

  ${(props) =>
    props.$inverted &&
    css`
      float: right;

      &:before {
        border-left-width: 0;
        border-right-width: 14px;
        left: -14px;
        right: auto;
      }

      &:after {
        border-left-width: 0;
        border-right-width: 14px;
        left: -13px;
        right: auto;
      }
    `};

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.generalBackgroundLight};
    border: ${(props) => props.theme.dark.dividerColor} 1px solid;
    box-shadow: ${(props) => props.theme.dark.boxShadowLight} 0 1px 6px;

    &:before {
      border-left: ${(props) => props.theme.dark.dividerColor} 14px solid;
      border-right: ${(props) => props.theme.dark.dividerColor} 0px solid;
    }

    &:after {
      border-left: ${(props) => props.theme.dark.generalBackgroundLight} 14px
        solid;
      border-right: ${(props) => props.theme.dark.generalBackgroundLight} 0px
        solid;
    }

    ${(props) =>
      props.$inverted &&
      css`
        float: right;

        &:before {
          border-left-width: 0;
          border-right-width: 14px;
          left: -14px;
          right: auto;
        }

        &:after {
          border-left-width: 0;
          border-right-width: 14px;
          left: -13px;
          right: auto;
        }
      `};
  }
`;

const TimelineBadge = styled.div`
  visibility: hidden;

  ${mediaQuery.minWidth.md} {
    visibility: visible;
    background-color: ${(props) => props.theme.light.primaryColor};
    color: ${(props) => props.theme.light.textAbovePrimaryColor};
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 1.4em;
    text-align: center;
    position: absolute;
    top: 20px;
    left: 50%;
    margin-left: -20px;
    z-index: 100;
    border-radius: 50%;
  }

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.primaryColor};
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  }
`;

const TimelineTitle = styled.div`
  font-size: ${(props) => props.theme.fontSizes[7]};
  margin: ${(props) => props.theme.spacing[0]};
`;

const TimelineSubtitle = styled(Heading6)`
  text-align: left;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const TimelineDescription = styled(Paragraph)`
  text-align: left;
  margin-top: ${(props) => props.theme.spacing[2]};
`;

const TimelineTime = styled(Time)`
  margin: ${(props) => props.theme.spacing[0]};
  font-size: ${(props) => props.theme.fontSizes[3]};
`;

const TimelinePanelContentContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
`;

const imgSize = 80;

const TimelineImageContainer = styled.div`
  border: 1px solid gray;
  margin-left: ${(props) => props.theme.spacing[0]};
  margin-right: auto;
  margin-bottom: 15px;
  display: block;
  background-color: #fff;
  width: ${imgSize}px;
  height: ${imgSize}px;
`;

type TimelineElementProps = TimelinePanelProps & {
  icon: ReactElement;
  children?: ReactNode;
};

const TimelineElement: FC<TimelineElementProps> = ({
  children,
  inverted,
  icon,
}) => (
  <TimelineElementContainer>
    <TimelineBadge>{icon}</TimelineBadge>
    <TimelinePanel $inverted={inverted}>
      <TimelinePanelContentContainer>{children}</TimelinePanelContentContainer>
    </TimelinePanel>
  </TimelineElementContainer>
);

export const Timeline: FC = () => {
  const iconsSize = 20;
  const briefcase = <Briefcase size={iconsSize} />;
  const graduationCap = <GraduationCap size={iconsSize} />;

  return (
    <TimelineContentContainer>
      <TimelineContainer>
        <TimelineElement inverted={false} icon={briefcase}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={lastminuteImage}
              alt={"lastminute"}
              placeholder={'blur'}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"https://lmgroup.lastminute.com/"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Lastminute.com group</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>Mobile application developer</TimelineSubtitle>
          <TimelineTime>February 2017</TimelineTime>
          <TimelineDescription>
            Designing and implementing iOS and Android apps for the main brands
            of the company:
          </TimelineDescription>
          <List>
            <li>lastminute.com</li>
            <li>Volagratis</li>
            <li>Rumbo</li>
            <li>Weg.de</li>
          </List>
        </TimelineElement>
        <TimelineElement inverted={true} icon={graduationCap}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={unimibImage}
              placeholder={'blur'}
              alt={"unimib"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"https://www.disco.unimib.it/it"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Milano-Bicocca University</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>
            {"Master's degree in Computer Science"}
          </TimelineSubtitle>
          <TimelineTime>July 2016</TimelineTime>
          <TimelineDescription>
            Thesis: “Spectral Clara Lux Tracer: physically based ray tracer with
            multiple shading models support”. You can find more info about it in
            the project section.
          </TimelineDescription>
          <List>
            <li>Computer graphics</li>
            <li>Software engineering</li>
            <li>Algorithm and Theoretical CS</li>
            <li>IT security</li>
            <li>IT management</li>
            <li>Design and user experience</li>
          </List>
        </TimelineElement>
        <TimelineElement inverted={false} icon={briefcase}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={condenastImage}
              placeholder={'blur'}
              alt={"condenast"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"https://www.condenast.it"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Condé Nast Italia</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>Mobile/Web application developer</TimelineSubtitle>
          <TimelineTime>June 2013</TimelineTime>
          <TimelineDescription>
            Designing and implementing iOS and Android apps for the main brands
            of the company: Vanity Fair, Glamour, Wired, Vogue. I also worked
            with the web team to develop the new version of the official web
            sites for GQ Italia, Glamour, CNLive! and Vogue Italia.
          </TimelineDescription>
        </TimelineElement>
        <TimelineElement inverted={false} icon={briefcase}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={shiImage}
              placeholder={"blur"}
              alt={"shi"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={
              "https://www.linkedin.com/company/shi-srl/?originalSubdomain=it"
            }
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>SHI</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>iOS/Web Developer</TimelineSubtitle>
          <TimelineTime>October 2010</TimelineTime>
          <TimelineDescription>
            Design and development of mobile application on iOS, Android and
            Windows phone platform, for enterprise distribution (ad-hoc
            distribution) or within the various app store. Design and
            development of Web application used as backend for mobile app.
            Design and development of Enterprise Web application.
          </TimelineDescription>
        </TimelineElement>
        <TimelineElement inverted={false} icon={briefcase}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={bottinelliImage}
              placeholder={"blur"}
              alt={"bottinelli informatica"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"#"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Bottinelli informatica</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>Developer</TimelineSubtitle>
          <TimelineTime>August 2009</TimelineTime>
          <TimelineDescription>
            Software development for textile industry.
          </TimelineDescription>
        </TimelineElement>
        <TimelineElement inverted={false} icon={briefcase}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={avanadeImage}
              placeholder={"blur"}
              alt={"avanade"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"https://www.avanade.com"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Avanade</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>PMO Consultant</TimelineSubtitle>
          <TimelineTime>October 2008</TimelineTime>
          <TimelineDescription>
            {" "}
            Assigned on Eurosig integration BA-HVB/Unicredit project, I worked
            with the Accenture Consultant team as a PMO.
          </TimelineDescription>
          <List>
            <li>
              Tracking creation and evolution of functional specification to
              cover the gaps between ASC, CRE, PAY, MDM and BSS sector of the
              IT systems of Unicredit and HVB bank.
            </li>
            <li>
              Publishing statistics to show the state of art of the functional
              specification produced, the open change request and the state of
              user test. Maintenance of tools created with Microsoft Excel,
              Microsoft Powerpoint and VBA used to generate the above
              mentioned statistics.
            </li>
            <li>
              Maintenance of tools used to manage WBS of the project inside
              Accenture team.
            </li>
          </List>
        </TimelineElement>
        <TimelineElement inverted={true} icon={graduationCap}>
          <TimelineImageContainer>
            <Image
              width={imgSize}
              height={imgSize}
              src={insubriaImage}
              placeholder={"blur"}
              alt={"insubria"}
            />
          </TimelineImageContainer>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"https://www.uninsubria.it"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>Insubria University</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>
            {"Bachelor's degree in Computer Science"}
          </TimelineSubtitle>
          <TimelineTime>October 2008</TimelineTime>
          <TimelineDescription>
            Thesis: “Grandi Giardini: implementazione di un portale web con
            funzionalità e-commerce”. A web e-commerce developed for Grandi
            Giardini Italiani s.r.l., a company dealing with the organization of
            events in some of the most beautiful italian gardens (never deployed
            in production).
          </TimelineDescription>
          <List>
            <li>Software engineering</li>
            <li>Algorithm and Theoretical CS</li>
            <li>IT security</li>
            <li>IT management</li>
            <li>Networking</li>
            <li>Programming</li>
          </List>
        </TimelineElement>
        <TimelineElement inverted={true} icon={graduationCap}>
          <StandardExternalLinkWithTracking
            trackingData={{
              action: tracking.action.open_experience_and_education,
              category: tracking.category.home,
              label: tracking.label.body,
            }}
            href={"#"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <TimelineTitle>ITCG Romagnosi</TimelineTitle>
          </StandardExternalLinkWithTracking>
          <TimelineSubtitle>High school in Accountant</TimelineSubtitle>
          <TimelineTime>July 2005</TimelineTime>
        </TimelineElement>
      </TimelineContainer>
    </TimelineContentContainer>
  );
};
