import { Heading, Img, Section, Text } from "@react-email/components";
import { emailColors, emailFonts } from "./contact-email-shared-colors";

export function EmailBrandHeader() {
    return (
        <Section style={brandHeaderBox}>
            {/* Background Image */}
            <Img
                src="https://www.fabrizioduroni.it/images/email/matrix-rain.png"
                alt=""
                style={backgroundImage}
            />
            
            {/* Content */}
            <table style={{ width: "100%", position: "relative" as const, zIndex: 1 }}>
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
                            <Text style={brandSubtitle}>Pixels. Code. Unplugged.</Text>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Section>
    );
}

const brandHeaderBox = {
    backgroundColor: emailColors.backgroundAlpha60,
    border: `1px solid ${emailColors.accentAlpha40}`,
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: emailColors.boxShadow,
    position: "relative" as const,
    overflow: "hidden" as const,
};

const backgroundImage = {
    position: "absolute" as const,
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: "0 0 12px 12px",
    opacity: 0.3,
    zIndex: 0,
};

const logoStyle = {
    display: "block",
    border: `1px solid ${emailColors.accentAlpha40}`,
    borderRadius: "12px",
};

const brandTitle = {
    color: emailColors.accent,
    fontSize: "28px",
    fontWeight: "bold" as const,
    margin: "0",
    padding: "0",
    lineHeight: "1.2",
    fontFamily: emailFonts.mono,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    textShadow: emailColors.textShadowStrong,
};

const brandSubtitle = {
    color: emailColors.primaryText,
    fontSize: "13px",
    margin: "4px 0 0 0",
    padding: "0",
    fontFamily: emailFonts.mono,
    textShadow: emailColors.textShadowLight,
};

const cursor = {
    color: emailColors.accent,
};

const prompt = {
    color: emailColors.accent,
    fontWeight: "bold" as const,
};
