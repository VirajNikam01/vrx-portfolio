import type { ExperienceItemType, ExperiencePositionItemType } from "@/shared/contracts/work-experience";

type DateRange = {
    start: Date;
    end: Date;
};

type MonthDayDuration = {
    totalMonths: number;
    days: number;
};

const MONTHS_PER_YEAR = 12;
const DAY_ROLLOVER_THRESHOLD = 30;
const PROFESSIONAL_POSITION_CATEGORY = "professional";
const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export function getExperienceDurationLabel(
    experiences: ExperienceItemType[],
    currentDate = new Date()
) {
    const totalDuration = countExperienceDuration(experiences, currentDate);

    return formatDuration(totalDuration);
}

export function getPositionDurationLabel(
    position: ExperiencePositionItemType,
    currentDate = new Date()
) {
    return formatDuration(getMonthDayDiff(toDateRange(position, currentDate)));
}

export function getPositionPeriodLabel(position: ExperiencePositionItemType) {
    const startLabel = formatFullDate(position.startDate);
    const endLabel = position.endDate
        ? formatFullDate(position.endDate)
        : "Present";

    return `${startLabel} - ${endLabel}`;
}

function formatDuration({ totalMonths, days }: MonthDayDuration) {
    if (totalMonths <= 0) {
        const dayCount = Math.max(days, 1);
        return `${dayCount} ${dayCount === 1 ? "day" : "days"}`;
    }

    if (totalMonths < MONTHS_PER_YEAR) {
        return `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`;
    }

    const years = Math.floor(totalMonths / MONTHS_PER_YEAR);
    const months = totalMonths % MONTHS_PER_YEAR;

    if (months === 0) {
        return `${years} ${years === 1 ? "year" : "years"}`;
    }

    return `${years}.${months} ${years <= 1 ? "year" : "years"
        }`;
}

function countExperienceDuration(
    experiences: ExperienceItemType[],
    currentDate: Date
): MonthDayDuration {
    const ranges = getExperienceRanges(experiences, currentDate);
    const mergedRanges = mergeRanges(ranges);

    return mergedRanges.reduce<MonthDayDuration>(
        (total, range) => addDurations(total, getMonthDayDiff(range)),
        { totalMonths: 0, days: 0 }
    );
}

function addDurations(
    first: MonthDayDuration,
    second: MonthDayDuration
): MonthDayDuration {
    let totalMonths = first.totalMonths + second.totalMonths;
    let days = first.days + second.days;

    if (days >= DAY_ROLLOVER_THRESHOLD) {
        totalMonths += 1;
        days -= DAY_ROLLOVER_THRESHOLD;
    }

    return { totalMonths, days };
}

function getExperienceRanges(
    experiences: ExperienceItemType[],
    currentDate: Date
) {
    return experiences
        .flatMap((experience) => experience.positions)
        .filter(isProfessionalPosition)
        .map((position) => toDateRange(position, currentDate))
        .sort((firstRange, secondRange) => {
            return firstRange.start.getTime() - secondRange.start.getTime();
        });
}

function isProfessionalPosition(position: ExperiencePositionItemType) {
    return position.category === PROFESSIONAL_POSITION_CATEGORY;
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

function formatFullDate(value: string) {
    return FULL_DATE_FORMATTER.format(parseDate(value));
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

function getMonthDayDiff({ start, end }: DateRange): MonthDayDuration {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months -= 1;
        days += getDaysInMonthBefore(end);
    }

    if (months < 0) {
        years -= 1;
        months += MONTHS_PER_YEAR;
    }

    return { totalMonths: years * MONTHS_PER_YEAR + months, days };
}

function getDaysInMonthBefore(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}