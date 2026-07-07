export interface AnalyticsConfig {
    propertyId: string;
    clientEmail: string;
    privateKey: string;
}

export interface AnalyticsEnv {
    GOOGLE_ANALYTICS_PROPERTY_ID?: string;
    GOOGLE_ANALYTICS_SA_CLIENT_EMAIL?: string;
    GOOGLE_ANALYTICS_SA_PRIVATE_KEY?: string;
}

const readProcessEnv = (): AnalyticsEnv => process.env as AnalyticsEnv;

export const readAnalyticsConfig = (env: AnalyticsEnv = readProcessEnv()): AnalyticsConfig | null => {
    const { GOOGLE_ANALYTICS_PROPERTY_ID, GOOGLE_ANALYTICS_SA_CLIENT_EMAIL, GOOGLE_ANALYTICS_SA_PRIVATE_KEY } = env;

    if (!GOOGLE_ANALYTICS_PROPERTY_ID || !GOOGLE_ANALYTICS_SA_CLIENT_EMAIL || !GOOGLE_ANALYTICS_SA_PRIVATE_KEY) {
        return null;
    }

    return {
        propertyId: GOOGLE_ANALYTICS_PROPERTY_ID,
        clientEmail: GOOGLE_ANALYTICS_SA_CLIENT_EMAIL,
        privateKey: GOOGLE_ANALYTICS_SA_PRIVATE_KEY.replaceAll("\\n", "\n"),
    };
};
