import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Hr,
} from "@react-email/components";

interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
}

export function ContactEmail({
    name,
    email,
    message,
}: ContactEmailProps) {
    return (
        <Html>
            <Head>
                <meta name="color-scheme" content="dark" />
                <meta name="supported-color-schemes" content="dark" />
            </Head>
            <Preview>New contact from {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={brandHeaderBox}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            verticalAlign: "middle",
                                            paddingRight: "12px",
                                        }}
                                    >
                                        <Img
                                            src="https://www.fabrizioduroni.it/images/logo.png"
                                            alt="Chicio Coding Logo"
                                            width={60}
                                            height={60}
                                            style={logoStyle}
                                        />
                                    </td>
                                    <td style={{ verticalAlign: "middle" }}>
                                        <Heading style={brandTitle}>
                                            <span style={prompt}>{">"}</span> CHICIO CODING
                                            <span style={cursor}>_</span>
                                        </Heading>
                                        <Text style={brandSubtitle}>
                                            Pixels. Code. Unplugged.
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>
                    <Section style={quoteSection}>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "Wake up, {name}..."
                        </Text>
                        <Text style={quoteText}>
                            <span style={prompt}>{">"}</span> "The Matrix has you."
                        </Text>
                    </Section>
                    <Hr style={divider} />
                    <Section style={terminalSection}>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> INCOMING_TRANSMISSION
                        </Text>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> STATUS:{" "}
                            <span style={statusSuccess}>DELIVERED</span>
                        </Text>
                    </Section>
                    <Hr style={divider} />
                    <Section style={terminalSection}>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> FROM: {name}
                        </Text>
                        <Text style={terminalLine}>
                            <span style={prompt}>{">"}</span> EMAIL: {email}
                        </Text>
                    </Section>
                    <Hr style={divider} />
                    <Section style={terminalSection}>
                        <Text style={messageLabel}>
                            <span style={prompt}>{">"}</span> MESSAGE:
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
                    <Section style={footer}>
                        <Text style={footerText}>
                            <span style={prompt}>{">"}</span> Transmitted from:{" "}
                            <a
                                href="https://www.fabrizioduroni.it/contact"
                                style={footerLink}
                            >
                                fabrizioduroni.it
                            </a>
                        </Text>
                        <Text style={footerText}>
                            <span style={prompt}>{">"}</span> Follow the white rabbit 🐰
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

ContactEmail.PreviewProps = {
    name: "Neo",
    email: "neo@thematrix.io",
    message:
        "I know you're out there. I can feel you now. I know that you're afraid... you're afraid of us. You're afraid of change.",
} as ContactEmailProps;

export default ContactEmail;

// Color palette - mapped from src/app/css/globals.css
const emailColors = {
    background: "#001100", // --color-general-background
    backgroundLight: "#002200", // --color-general-background-light
    accent: "#39FF14", // --color-accent
    secondary: "#00CC33", // --color-secondary
    primaryText: "#E8FFE8", // --color-primary-text
    accentAlpha40: "rgba(57, 255, 20, 0.4)", // --color-accent-alpha-40
    accentAlpha25: "rgba(57, 255, 20, 0.25)", // --color-accent-alpha-25
    backgroundAlpha60: "rgba(0, 17, 0, 0.6)", // Custom for glassmorphism effect
    textShadowStrong: "0px 0px 5px rgba(57, 255, 20, 0.5), 0px 0px 10px rgba(57, 255, 20, 0.25)",     // Text shadow values
    textShadowLight: "0px 0px 3px rgba(57, 255, 20, 0.5)",     // Text shadow values
    boxShadow: "0 0 15px rgba(57, 255, 20, 0.4)", // Box shadow
};

const main = {
    backgroundColor: emailColors.background,
    fontFamily: '"Courier New", Courier, monospace',
    padding: "20px",
    margin: "0",
};

const container = {
    backgroundColor: emailColors.background,
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0",
};

const brandHeaderBox = {
    backgroundColor: emailColors.backgroundAlpha60,
    border: `1px solid ${emailColors.accentAlpha40}`,
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: emailColors.boxShadow,
};

const logoStyle = {
    display: "block",
    borderRadius: "4px",
};

const brandTitle = {
    color: emailColors.accent,
    fontSize: "28px",
    fontWeight: "bold" as const,
    margin: "0",
    padding: "0",
    lineHeight: "1.2",
    fontFamily: '"Courier New", Courier, monospace',
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    textShadow: emailColors.textShadowStrong,
};

const brandSubtitle = {
    color: emailColors.primaryText,
    fontSize: "13px",
    margin: "4px 0 0 0",
    padding: "0",
    fontFamily: '"Courier New", Courier, monospace',
    textShadow: emailColors.textShadowLight,
};

const cursor = {
    color: emailColors.accent,
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
    fontFamily: '"Courier New", Courier, monospace',
    fontStyle: "italic" as const,
    opacity: 0.9,
};

const terminalSection = {
    padding: "10px 0",
};

const terminalLine = {
    color: emailColors.accent,
    fontSize: "14px",
    margin: "6px 0",
    padding: "0",
    fontFamily: '"Courier New", Courier, monospace',
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

const messageLabel = {
    color: emailColors.accent,
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "0 0 10px 0",
    padding: "0",
    fontFamily: '"Courier New", Courier, monospace',
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
    fontFamily: '"Courier New", Courier, monospace',
};

const footer = {
    padding: "10px 0 0 0",
};

const footerText = {
    color: emailColors.secondary,
    fontSize: "12px",
    margin: "4px 0",
    padding: "0",
    fontFamily: '"Courier New", Courier, monospace',
};

const footerLink = {
    color: emailColors.accent,
    textDecoration: "underline",
};
