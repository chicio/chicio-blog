export interface AnalyticsConfig {
    propertyId: string;
    clientEmail: string;
    privateKey: string;
}

export interface AnalyticsEnv {
    GA_PROPERTY_ID?: string;
    GA_SA_CLIENT_EMAIL?: string;
    GA_SA_PRIVATE_KEY?: string;
}

const readProcessEnv = (): AnalyticsEnv => process.env as AnalyticsEnv;

export const readAnalyticsConfig = (env: AnalyticsEnv = readProcessEnv()): AnalyticsConfig | null => {
    const { GA_PROPERTY_ID, GA_SA_CLIENT_EMAIL, GA_SA_PRIVATE_KEY } = env;

    if (!GA_PROPERTY_ID || !GA_SA_CLIENT_EMAIL || !GA_SA_PRIVATE_KEY) {
        return null;
    }

    return {
        propertyId: GA_PROPERTY_ID,
        clientEmail: GA_SA_CLIENT_EMAIL,
        privateKey: GA_SA_PRIVATE_KEY.replaceAll("\\n", "\n"),
    };
};
