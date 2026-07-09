const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const formatAnalyticsMonth = (yearMonth: string): string => {
    if (!/^\d{6}$/.test(yearMonth)) {
        return yearMonth;
    }

    const year = Number(yearMonth.slice(0, 4));
    const monthIndex = Number(yearMonth.slice(4, 6)) - 1;

    if (monthIndex < 0 || monthIndex > 11) {
        return yearMonth;
    }

    return `${MONTH_NAMES[monthIndex]} ${year}`;
};

export const formatShortAnalyticsMonth = (yearMonth: string): string => {
    if (!/^\d{6}$/.test(yearMonth)) {
        return yearMonth;
    }

    const monthIndex = Number(yearMonth.slice(4, 6)) - 1;

    if (monthIndex < 0 || monthIndex > 11) {
        return yearMonth;
    }

    return `${MONTH_NAMES[monthIndex].slice(0, 3)} '${yearMonth.slice(2, 4)}`;
};
