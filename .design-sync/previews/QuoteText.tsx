import { QuoteText } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <QuoteText>This is your last chance...</QuoteText>
    </div>
);

export const OfflineQuote = () => (
    <div className="flex">
        <QuoteText>You are disconnected from the Matrix.</QuoteText>
    </div>
);

export const ShortQuote = () => (
    <div className="flex">
        <QuoteText>Déjà vu</QuoteText>
    </div>
);
