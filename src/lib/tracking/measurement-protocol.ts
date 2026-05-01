const GA_MEASUREMENT_ID = "G-B992TEM300";
const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";

export const trackMarkdownPageView = (pagePath: string) => {
    const apiSecret = process.env.GOOGLE_ANALYTICS_API_SECRET;

    if (!apiSecret) {
        return;
    }

    const url = `${GA_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${apiSecret}`;
    const clientId = crypto.randomUUID();

    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            client_id: clientId,
            events: [
                {
                    name: "page_view",
                    params: {
                        page_location: `https://www.fabrizioduroni.it${pagePath}`,
                        page_title: pagePath,
                        content_type: "markdown",
                    },
                },
            ],
        }),
    }).catch(() => {});
};
