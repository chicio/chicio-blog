/**
 * Shared email message summary component
 * 
 * @author Fabrizio Duroni
 */

import { Section, Text } from "@react-email/components";
import { emailColors, emailFonts } from "./contact-email-shared-colors";

interface MessageSummaryProps {
    message: string;
    label?: string;
}

export function MessageSummary({ message, label = "MESSAGE:" }: MessageSummaryProps) {
    return (
        <Section style={terminalSection}>
            <Text style={messageLabel}>
                <span style={prompt}>{">"}</span> {label}
            </Text>
            <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
            </Section>
        </Section>
    );
}

// Styles
const prompt = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
};

const terminalSection = {
    padding: "10px 0",
};

const messageLabel = {
    color: emailColors.accent,
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "0 0 10px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
};

const messageBox = {
    backgroundColor: emailColors.backgroundLight,
    border: `1px solid ${emailColors.accentAlpha40}`,
    borderRadius: "4px",
    padding: "15px",
    marginTop: "10px",
};

const messageText = {
    color: emailColors.primaryText,
    fontSize: "14px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap" as const,
    margin: "0",
    padding: "0",
    fontFamily: emailFonts.mono,
};
