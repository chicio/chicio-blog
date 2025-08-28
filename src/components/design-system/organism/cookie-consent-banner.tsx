"use client";

import { hasConsented, writeConsent } from "@/lib/consents/consents";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { glassmorphism } from "../atoms/effects/glassmorphism";
import { glowText } from "../atoms/effects/glow";
import { Paragraph } from "../atoms/typography/paragraph";
import {
    BluePillButton,
    RedPillButton,
} from "../molecules/buttons/pills-buttons";
import { mediaQuery } from "../utils/media-query";

const BannerContainer = styled.div`
  ${glassmorphism}
  position: fixed;
  padding: ${(props) => props.theme.spacing[3]};
  bottom: ${(props) => props.theme.spacing[3]};
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 95%;

  ${mediaQuery.minWidth.lg} {
    max-width: 60%;
    flex-direction: row;
    align-items: center;
  }

  ${mediaQuery.maxWidth.xs} {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
`;

const BannerText = styled(Paragraph)`
  ${glowText};
  text-align: left;
  margin: 0;
`;

const PillsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing[3]};
`;

const RedPillText = styled.span`
  color: ${(props) => props.theme.colors.confirmColor};
`;

const BluePillText = styled.span`
  color: ${(props) => props.theme.colors.undoColor};
`;

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) { 
        setVisible(true);
    }
  }, []);

  const handle = (accepted: "accepted" | "rejected") => {
    writeConsent(accepted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <BannerContainer role="dialog" aria-live="polite">
      <BannerText>
        This website uses cookies. Take the <RedPillText>red pill</RedPillText>, and you’ll see how deep
        the rabbit hole goes. Take the <BluePillText>blue pill</BluePillText>, and the story ends, you wake
        up in your browser and believe whatever you want.
      </BannerText>
      <PillsContainer>
        <BluePillButton
          onClick={() => handle("rejected")}
          aria-label="Reject cookie"
        >
          Sleep (Reject)
        </BluePillButton>
        <RedPillButton
          onClick={() => handle("accepted")}
          aria-label="Accept cookie"
        >
          Wake up (Accept)
        </RedPillButton>
      </PillsContainer>
    </BannerContainer>
  );
};
