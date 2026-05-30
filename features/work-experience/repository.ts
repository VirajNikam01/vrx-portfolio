import { asc, eq, inArray } from "drizzle-orm";

import { workExperiences } from "@/config/work-experience";
import { getDb } from "@/lib/db/client";
import {
    workExperienceCompanies,
    workExperiencePositionDescriptions,
    workExperiencePositions,
    workExperiencePositionSkills,
} from "@/lib/db/schema";

import { workExperiencesSchema } from "./schema";
import type { ExperienceItemType } from "./types";

const PUBLISHED_STATUS = "published";

export async function readWorkExperiences(): Promise<ExperienceItemType[]> {
    if (!process.env.DATABASE_URL) {
        return workExperiences;
    }

    try {
        return await readWorkExperiencesFromDatabase();
    } catch {
        return workExperiences;
    }
}

async function readWorkExperiencesFromDatabase() {
    const db = getDb();
    const companies = await db
        .select()
        .from(workExperienceCompanies)
        .where(eq(workExperienceCompanies.status, PUBLISHED_STATUS))
        .orderBy(asc(workExperienceCompanies.sortOrder));

    if (companies.length === 0) {
        return workExperiences;
    }

    const companyIds = companies.map((company) => company.id);
    const positions = await db
        .select()
        .from(workExperiencePositions)
        .where(inArray(workExperiencePositions.companyId, companyIds))
        .orderBy(asc(workExperiencePositions.sortOrder));

    const positionIds = positions.map((position) => position.id);
    const [descriptions, skills] =
        positionIds.length > 0
            ? await Promise.all([
                  db
                      .select()
                      .from(workExperiencePositionDescriptions)
                      .where(
                          inArray(
                              workExperiencePositionDescriptions.positionId,
                              positionIds,
                          ),
                      )
                      .orderBy(
                          asc(workExperiencePositionDescriptions.sortOrder),
                      ),
                  db
                      .select()
                      .from(workExperiencePositionSkills)
                      .where(
                          inArray(
                              workExperiencePositionSkills.positionId,
                              positionIds,
                          ),
                      )
                      .orderBy(asc(workExperiencePositionSkills.sortOrder)),
              ])
            : [[], []];

    const positionsByCompanyId = groupBy(positions, (position) =>
        String(position.companyId),
    );
    const descriptionsByPositionId = groupBy(descriptions, (description) =>
        String(description.positionId),
    );
    const skillsByPositionId = groupBy(skills, (skill) =>
        String(skill.positionId),
    );

    return workExperiencesSchema.parse(
        companies.map((company) => ({
            id: company.key,
            companyName: company.companyName,
            ...(company.companyLogo ? { companyLogo: company.companyLogo } : {}),
            isCurrentEmployer: company.isCurrentEmployer,
            positions: (positionsByCompanyId.get(String(company.id)) ?? []).map(
                (position) => ({
                    id: position.key,
                    title: position.title,
                    category: position.category,
                    startDate: position.startDate,
                    ...(position.endDate ? { endDate: position.endDate } : {}),
                    ...(position.employmentType
                        ? { employmentType: position.employmentType }
                        : {}),
                    ...(position.icon ? { icon: position.icon } : {}),
                    isExpanded: position.isExpanded,
                    description: (
                        descriptionsByPositionId.get(String(position.id)) ?? []
                    ).map((description) => description.body),
                    skills: (
                        skillsByPositionId.get(String(position.id)) ?? []
                    ).map((skill) => skill.name),
                }),
            ),
        })),
    );
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
    return items.reduce((groups, item) => {
        const key = getKey(item);
        const values = groups.get(key) ?? [];
        values.push(item);
        groups.set(key, values);
        return groups;
    }, new Map<string, T[]>());
}
