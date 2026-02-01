/**
 * Email notification template - sent to site owner when contact form is submitted
 * 
 * @author Fabrizio Duroni
 */

import { Body, Container, Head, Html, Hr, Preview, Section, Text } from "@react-email/components";
import { EmailBrandHeader } from "./contact-email-shared-brand-header";
import { emailColors, emailFonts } from "./contact-email-shared-colors";
import { EmailFooter } from "./contact-email-shared-footer";
import { MessageSummary } from "./contact-email-shared-message-summary";

interface ContactNotificationEmailProps {
    name: string;
    email: string;
    message: string;
}

export function ContactNotificationEmail({
    name,
    email,
    message,
}: ContactNotificationEmailProps) {
    return (
        <Html>
            <Head>
                <meta name="color-scheme" content="dark" />
                <meta name="supported-color-schemes" content="dark" />
            </Head>
            <Preview>New contact from {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <EmailBrandHeader />
                    <Section style={terminalSection}>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> FROM: {name}
                        </Text>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> EMAIL: {email}
                        </Text>
                    </Section>
                    <Hr style={divider} />
                    <MessageSummary message={message} />
                    <EmailFooter />
                </Container>
            </Body>
        </Html>
    );
}

ContactNotificationEmail.PreviewProps = {
    name: "Neo",
    email: "neo@thematrix.io",
    message:
        "I know you're out there. I can feel you now. I know that you're afraid... you're afraid of us. You're afraid of change.",
} as ContactNotificationEmailProps;

export default ContactNotificationEmail;

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

const divider = {
    borderColor: emailColors.accentAlpha25,
    borderStyle: "dashed" as const,
    borderWidth: "1px 0 0 0",
    margin: "15px 0",
};
