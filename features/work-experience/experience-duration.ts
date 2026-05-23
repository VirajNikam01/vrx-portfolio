import type { ExperienceItemType, ExperiencePositionItemType } from "./types";

type DateRange = {
    start: Date;
    end: Date;
};

const MONTHS_PER_YEAR = 12;

export function getExperienceDurationLabel(
    experiences: ExperienceItemType[],
    currentDate = new Date()
) {
    const totalMonths = countExperienceMonths(experiences, currentDate);

    return formatMonthCount(totalMonths);
}

export function getPositionDurationLabel(
    position: ExperiencePositionItemType,
    currentDate = new Date()
) {
    return formatMonthCount(countMonths(toDateRange(position, currentDate)));
}

function formatMonthCount(totalMonths: number) {
    if (totalMonths < MONTHS_PER_YEAR) {
        return `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`;
    }

    const years = Math.floor(totalMonths / MONTHS_PER_YEAR);
    const months = totalMonths % MONTHS_PER_YEAR;

    if (months === 0) {
        return `${years} ${years === 1 ? "year" : "years"}`;
    }

    return `${years} ${years === 1 ? "year" : "years"} ${months} ${
        months === 1 ? "month" : "months"
    }`;
}

function countExperienceMonths(
    experiences: ExperienceItemType[],
    currentDate: Date
) {
    const ranges = getExperienceRanges(experiences, currentDate);
    const mergedRanges = mergeRanges(ranges);

    return mergedRanges.reduce(
        (totalMonths, range) => totalMonths + countMonths(range),
        0
    );
}

function getExperienceRanges(
    experiences: ExperienceItemType[],
    currentDate: Date
) {
    return experiences
        .flatMap((experience) => experience.positions)
        .filter(countsTowardExperience)
        .map((position) => toDateRange(position, currentDate))
        .sort((firstRange, secondRange) => {
            return firstRange.start.getTime() - secondRange.start.getTime();
        });
}

function countsTowardExperience(position: ExperiencePositionItemType) {
    return position.countsTowardExperience !== false;
}

function toDateRange(
    position: ExperiencePositionItemType,
    currentDate: Date
): DateRange {
    return {
        start: parseDate(position.startDate),
        end: position.endDate ? parseDate(position.endDate) : currentDate,
    };
}

function parseDate(value: string) {
    return new Date(`${value}T00:00:00`);
}

function mergeRanges(ranges: DateRange[]) {
    return ranges.reduce<DateRange[]>((mergedRanges, range) => {
        const previousRange = mergedRanges.at(-1);

        if (!previousRange || range.start > previousRange.end) {
            return [...mergedRanges, { ...range }];
        }

        previousRange.end = maxDate(previousRange.end, range.end);
        return mergedRanges;
    }, []);
}

function maxDate(firstDate: Date, secondDate: Date) {
    return firstDate > secondDate ? firstDate : secondDate;
}

function countMonths(range: DateRange) {
    const startYear = range.start.getFullYear();
    const startMonth = range.start.getMonth();
    const endYear = range.end.getFullYear();
    const endMonth = range.end.getMonth();

    return (endYear - startYear) * MONTHS_PER_YEAR + endMonth - startMonth + 1;
}
