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
            <Text style={footerText}>
                <span style={prompt}>{">"}</span> Follow the white rabbit 🐰
            </Text>
            <Text style={footerCreditText}>
                Made with 💝 by Fabrizio Duroni 'Chicio'
            </Text>
        </Section>
    );
}

// Styles
const footer = {
    padding: "10px 0 0 0",
};

const footerText = {
    color: emailColors.secondary,
    fontSize: "12px",
    margin: "4px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
};

const footerLinkText = {
    color: emailColors.secondary,
    fontSize: "14px",
    margin: "6px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
};

const footerLink = {
    color: emailColors.accent,
    textDecoration: "underline",
    fontWeight: "bold" as const,
    fontSize: "16px",
};

const footerCreditText = {
    color: emailColors.primaryText,
    fontSize: "11px",
    margin: "10px 0 0 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    textAlign: "center" as const,
    opacity: 0.8,
};

const prompt = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
};
