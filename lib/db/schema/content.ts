import {
    boolean,
    bigint,
    bigserial,
    date,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import {
    experiencePositionCategory,
    experiencePositionIcon,
    introductionActionKind,
    introductionStatementEmphasis,
    jsonRecord,
    publishStatus,
} from "./shared";

export const uiPages = pgTable(
    "ui_pages",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        path: text("path").notNull(),
        title: text("title").notNull(),
        status: publishStatus("status").default("draft").notNull(),
        seo: jsonRecord("seo").default({}).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("ui_pages_key_unique").on(table.key),
        unique("ui_pages_path_unique").on(table.path),
        index("ui_pages_status_idx").on(table.status),
    ],
);

export const uiSections = pgTable(
    "ui_sections",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        pageId: bigint("page_id", { mode: "number" })
            .notNull()
            .references(() => uiPages.id, { onDelete: "cascade" }),
        key: text("key").notNull(),
        componentKey: text("component_key").notNull(),
        title: text("title"),
        isEnabled: boolean("is_enabled").default(true).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        status: publishStatus("status").default("draft").notNull(),
        props: jsonRecord("props").default({}).notNull(),
        dataSource: jsonRecord("data_source").default({}).notNull(),
        visibilityRules: jsonRecord("visibility_rules").default({}).notNull(),
        designOverrides: jsonRecord("design_overrides").default({}).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("ui_sections_page_key_unique").on(table.pageId, table.key),
        index("ui_sections_page_status_sort_idx").on(
            table.pageId,
            table.status,
            table.sortOrder,
        ),
        index("ui_sections_component_key_idx").on(table.componentKey),
    ],
);

export const introductions = pgTable(
    "introductions",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        eyebrow: text("eyebrow").notNull(),
        headline: text("headline").notNull(),
        intro: text("intro").notNull(),
        imageSrc: text("image_src").notNull(),
        imageAlt: text("image_alt").notNull(),
        status: publishStatus("status").default("draft").notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("introductions_key_unique").on(table.key),
        index("introductions_status_idx").on(table.status),
    ],
);

export const introductionStatementSegments = pgTable(
    "introduction_statement_segments",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        introductionId: bigint("introduction_id", { mode: "number" })
            .notNull()
            .references(() => introductions.id, { onDelete: "cascade" }),
        text: text("text").notNull(),
        emphasis: introductionStatementEmphasis("emphasis"),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("introduction_statement_intro_sort_unique").on(
            table.introductionId,
            table.sortOrder,
        ),
        index("introduction_statement_intro_sort_idx").on(
            table.introductionId,
            table.sortOrder,
        ),
    ],
);

export const introductionActions = pgTable(
    "introduction_actions",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        introductionId: bigint("introduction_id", { mode: "number" })
            .notNull()
            .references(() => introductions.id, { onDelete: "cascade" }),
        kind: introductionActionKind("kind").notNull(),
        label: text("label").notNull(),
        href: text("href"),
        fileUrl: text("file_url"),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("introduction_actions_intro_kind_unique").on(
            table.introductionId,
            table.kind,
        ),
        index("introduction_actions_intro_sort_idx").on(
            table.introductionId,
            table.sortOrder,
        ),
    ],
);

export const workExperienceCompanies = pgTable(
    "work_experience_companies",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        companyName: text("company_name").notNull(),
        companyLogo: text("company_logo"),
        isCurrentEmployer: boolean("is_current_employer").default(false).notNull(),
        status: publishStatus("status").default("draft").notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("work_experience_companies_key_unique").on(table.key),
        index("work_experience_companies_status_sort_idx").on(
            table.status,
            table.sortOrder,
        ),
    ],
);

export const workExperiencePositions = pgTable(
    "work_experience_positions",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        companyId: bigint("company_id", { mode: "number" })
            .notNull()
            .references(() => workExperienceCompanies.id, {
                onDelete: "cascade",
            }),
        key: text("key").notNull(),
        title: text("title").notNull(),
        category: experiencePositionCategory("category").notNull(),
        startDate: date("start_date", { mode: "string" }).notNull(),
        endDate: date("end_date", { mode: "string" }),
        employmentType: text("employment_type"),
        icon: experiencePositionIcon("icon"),
        isExpanded: boolean("is_expanded").default(false).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("work_experience_positions_company_key_unique").on(
            table.companyId,
            table.key,
        ),
        index("work_experience_positions_company_sort_idx").on(
            table.companyId,
            table.sortOrder,
        ),
    ],
);

export const workExperiencePositionDescriptions = pgTable(
    "work_experience_position_descriptions",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        positionId: bigint("position_id", { mode: "number" })
            .notNull()
            .references(() => workExperiencePositions.id, {
                onDelete: "cascade",
            }),
        body: text("body").notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("work_experience_descriptions_position_sort_unique").on(
            table.positionId,
            table.sortOrder,
        ),
        index("work_experience_descriptions_position_sort_idx").on(
            table.positionId,
            table.sortOrder,
        ),
    ],
);

export const workExperiencePositionSkills = pgTable(
    "work_experience_position_skills",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        positionId: bigint("position_id", { mode: "number" })
            .notNull()
            .references(() => workExperiencePositions.id, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("work_experience_skills_position_name_unique").on(
            table.positionId,
            table.name,
        ),
        index("work_experience_skills_position_sort_idx").on(
            table.positionId,
            table.sortOrder,
        ),
    ],
);

export type NewUiPage = typeof uiPages.$inferInsert;
export type UiPage = typeof uiPages.$inferSelect;

export type NewUiSection = typeof uiSections.$inferInsert;
export type UiSection = typeof uiSections.$inferSelect;

export type NewIntroduction = typeof introductions.$inferInsert;
export type Introduction = typeof introductions.$inferSelect;

export type NewIntroductionStatementSegment =
    typeof introductionStatementSegments.$inferInsert;
export type IntroductionStatementSegment =
    typeof introductionStatementSegments.$inferSelect;

export type NewIntroductionAction = typeof introductionActions.$inferInsert;
export type IntroductionAction = typeof introductionActions.$inferSelect;

export type NewWorkExperienceCompany =
    typeof workExperienceCompanies.$inferInsert;
export type WorkExperienceCompany = typeof workExperienceCompanies.$inferSelect;

export type NewWorkExperiencePosition =
    typeof workExperiencePositions.$inferInsert;
export type WorkExperiencePosition = typeof workExperiencePositions.$inferSelect;

export type NewWorkExperiencePositionDescription =
    typeof workExperiencePositionDescriptions.$inferInsert;
export type WorkExperiencePositionDescription =
    typeof workExperiencePositionDescriptions.$inferSelect;

export type NewWorkExperiencePositionSkill =
    typeof workExperiencePositionSkills.$inferInsert;
export type WorkExperiencePositionSkill =
    typeof workExperiencePositionSkills.$inferSelect;
