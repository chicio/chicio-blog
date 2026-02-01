import { Heading, Img, Section, Text, Row, Column } from "@react-email/components";
import { emailColors, emailFonts } from "./contact-email-shared-colors";

export function EmailBrandHeader() {
    return (
        <Section style={brandHeaderBox}>
            <Row>
                <Column style={{ width: "60px", verticalAlign: "middle", paddingRight: "12px" }}>
                    <Img
                        src="https://www.fabrizioduroni.it/images/logo.png"
                        alt="Chicio Coding Logo"
                        width={60}
                        height={60}
                        style={logoStyle}
                    />
                </Column>
                <Column style={{ verticalAlign: "middle" }}>
                    <Heading style={brandTitle}>
                        <span style={prompt}>{">"}</span> CHICIO CODING
                        <span style={cursor}>_</span>
                    </Heading>
                    <Text style={brandSubtitle}>Pixels. Code. Unplugged.</Text>
                </Column>
            </Row>
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
