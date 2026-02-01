import { Body, Container, Head, Html, Hr, Preview, Section, Text } from "@react-email/components";
import { EmailBrandHeader } from "./contact-email-shared-brand-header";
import { emailColors, emailFonts } from "./contact-email-shared-colors";
import { EmailFooter } from "./contact-email-shared-footer";

interface ContactConfirmationEmailProps {
    name: string;
    message: string;
}

export function ContactConfirmationEmail({ name, message }: ContactConfirmationEmailProps) {
    return (
        <Html>
            <Head>
                <meta name="color-scheme" content="dark" />
                <meta name="supported-color-schemes" content="dark" />
            </Head>
            <Preview>Message received - Thank you for contacting me</Preview>
            <Body style={main}>
                <Container style={container}>
                    <EmailBrandHeader />
                    <Section style={quoteSection}>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "Wake up, {name}..."
                        </Text>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "The Matrix has you."
                        </Text>
                    </Section>
                    <Hr style={divider} />

                    {/* Transmission Status */}
                    <Section style={terminalSection}>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> TRANSMISSION_CONFIRMED
                        </Text>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> STATUS:{" "}
                            <span style={statusSuccess}>DELIVERED</span>
                        </Text>
                    </Section>

                    <Hr style={divider} />

                    <Section style={confirmationSection}>
                        <Text style={confirmationTitle}>
                            <span style={prompt}>{">"}</span> MESSAGE_RECEIVED
                        </Text>
                        <Text style={confirmationText}>
                            Thank you for reaching out! Your message has been successfully
                            delivered.
                        </Text>
                        <Text style={confirmationText}>
                            I'll get back to you as soon as possible.
                        </Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Message Summary */}
                    <Section style={terminalSection}>
                        <Text style={messageLabel}>
                            <span style={prompt}>{">"}</span> YOUR_MESSAGE:
                        </Text>
                        <Section style={messageBox}>
                            <Text style={messageText}>{message}</Text>
                        </Section>
                    </Section>

                    <Hr style={divider} />
                    <Section style={quoteSection}>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "Unfortunately, no one can be
                            told what the Matrix is."
                        </Text>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "You have to see it for
                            yourself."
                        </Text>
                    </Section>

                    <Hr style={divider} />

                    <EmailFooter />
                </Container>
            </Body>
        </Html>
    );
}

ContactConfirmationEmail.PreviewProps = {
    name: "Neo",
    message:
        "I know you're out there. I can feel you now. I know that you're afraid... you're afraid of us. You're afraid of change.",
} as ContactConfirmationEmailProps;

export default ContactConfirmationEmail;

// Styles
const main = {
    backgroundColor: emailColors.background,
    fontFamily: emailFonts.mono,
    padding: "20px",
    margin: "0",
};

const container = {
    backgroundColor: emailColors.background,
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0",
};

const prompt = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
};

const quoteSection = {
    padding: "15px 0",
};

const quoteText = {
    color: emailColors.secondary,
    fontSize: "13px",
    margin: "4px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    fontStyle: "italic" as const,
    opacity: 0.9,
};

const divider = {
    borderColor: emailColors.accentAlpha25,
    borderStyle: "dashed" as const,
    borderWidth: "1px 0 0 0",
    margin: "15px 0",
};

const confirmationSection = {
    padding: "15px 0",
};

const confirmationTitle = {
    color: emailColors.accent,
    fontSize: "16px",
    fontWeight: "bold" as const,
    margin: "0 0 15px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    textTransform: "uppercase" as const,
};

const confirmationText = {
    color: emailColors.primaryText,
    fontSize: "14px",
    margin: "8px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    lineHeight: "1.6",
};

const terminalSection = {
    padding: "10px 0",
};

const terminalLine = {
    color: emailColors.accent,
    fontSize: "14px",
    margin: "6px 0",
    padding: "0",
    fontFamily: emailFonts.mono,
};

const statusSuccess = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
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
