import {
    Body,
    Container,
    Head,
    Html,
    Hr,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { EmailBrandHeader } from "@/components/content/contact/contact-email-shared-brand-header";
import { emailColors, emailFonts } from "@/components/content/contact/contact-email-shared-colors";
import { EmailFooter } from "@/components/content/contact/contact-email-shared-footer";
import { MessageSummary } from "@/components/content/contact/contact-email-shared-message-summary";

interface ContactConfirmationEmailProps {
    message: string;
}

export function ContactConfirmationEmail({ message }: ContactConfirmationEmailProps) {
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
                    <Hr style={divider} />
                    <Section style={terminalSection}>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> TRANSMISSION_CONFIRMED
                        </Text>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> STATUS:{" "}
                            <span style={statusSuccess}>DELIVERED</span>
                        </Text>
                        <Text style={confirmationText}>
                            Thank you for reaching out! Your message has been successfully delivered.
                        </Text>
                        <Text style={confirmationText}>
                            I&apos;ll get back to you as soon as possible.
                        </Text>
                    </Section>
                    <Hr style={divider} />
                    <MessageSummary message={message} label="YOUR_MESSAGE:" />
                    <Hr style={divider} />
                    <Section style={quoteSection}>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> &quot;Unfortunately, no one can be
                            told what the Matrix is.&quot;
                        </Text>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> &quot;You have to see it for yourself.&quot;
                        </Text>
                    </Section>
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
