/**
 * Shared email footer component
 * 
 * @author Fabrizio Duroni
 */

import { Section, Text } from "@react-email/components";
import { emailColors, emailFonts } from "./contact-email-shared-colors";

export function EmailFooter() {
    return (
        <Section style={footer}>
            <Text style={footerLinkText}>
                <span style={prompt}>{">"}</span> Transmitted from:{" "}
                <a href="https://www.fabrizioduroni.it" style={footerLink}>
                    fabrizioduroni.it
                </a>
            </Text>
            <Text style={footerCreditText}>
                <span style={prompt}>{">"} Made with 💝 by Fabrizio Duroni 'Chicio'</span>
            </Text>
        </Section>
    );
}

const footer = {
    width: "100%",
    backgroundColor: emailColors.backgroundLight,
    borderTop: `2px solid ${emailColors.accentAlpha40}`,
    borderRadius: "0 0 8px 8px",
    padding: "20px",
    marginTop: "20px",
};

const footerLinkText = {
    color: emailColors.accent,
    fontSize: "14px",
    margin: "0 0 10px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    textAlign: "center" as const,
};

const footerLink = {
    color: emailColors.accent,
    textDecoration: "underline",
    fontWeight: "bold" as const,
    fontSize: "16px",
};

const footerCreditText = {
    color: emailColors.secondary,
    fontSize: "11px",
    margin: "0",
    padding: "0",
    fontFamily: emailFonts.mono,
    textAlign: "center" as const,
    opacity: 0.7,
};

const prompt = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
};
