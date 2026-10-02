CREATE TABLE "content_configs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_configs_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX "content_configs_active_idx" ON "content_configs" USING btree ("is_active");
--> statement-breakpoint
INSERT INTO "content_configs" ("key", "content", "config")
VALUES (
	'landing-page',
	$${
		"introduction": {
			"eyebrow": "Software Developer",
			"headline": "I build polished, reliable web experiences.",
			"intro": "I'm Viraj, a frontend-focused developer who cares about clean architecture, thoughtful interaction design, and interfaces that feel fast, clear, and dependable in real use.",
			"image": {
				"src": "/images/intro/vrx-image.png",
				"alt": "Viraj Nikam portrait"
			},
			"statement": [
				{
					"text": "I'm Viraj Nikam, a passionate "
				},
				{
					"text": "Software Engineer",
					"emphasis": "solid"
				},
				{
					"text": " with "
				},
				{
					"text": "",
					"emphasis": "duration"
				},
				{
					"text": " of experience building "
				},
				{
					"text": "clean, reliable & scalable web/desktop applications",
					"emphasis": "accent"
				},
				{
					"text": " using React, Next.js, Tauri, TypeScript, and Tailwind CSS."
				}
			],
			"actions": {
				"connect": {
					"label": "Contact Me",
					"href": "mailto:virajnikam.connect@gmail.com"
				},
				"resume": {
					"label": "Download CV",
					"fileUrl": "/resume.pdf"
				}
			}
		},
		"workExperiences": [
			{
				"id": "1",
				"companyName": "Zybra",
				"isCurrentEmployer": true,
				"companyLogo": "/images/work-experience/zybra-logo.svg",
				"positions": [
					{
						"id": "full-stack-developer",
						"title": "Software Engineer",
						"category": "professional",
						"startDate": "2025-03-27",
						"employmentType": "Project Work",
						"icon": "code",
						"isExpanded": true,
						"description": [
							"Built and managed schemas with Drizzle ORM for PostgreSQL kept things typed, clean, and easy for the team to work with.",
							"Migrated the entire legacy MySQL database to PostgreSQL handled the schema changes, data cleanup, and made sure nothing got lost in between.",
							"Pulled Tally data into the new system and wrote the reconciliation logic to handle all the weird edge cases accountants run into.",
							"Wrote raw SQL wherever the ORM wasn't enough bulk ops, reporting queries, fixing slow joins with proper indexes."
						],
						"skills": [
							"Drizzle",
							"PostgreSQL",
							"MySQL",
							"Tally",
							"SQL",
							"Vitest",
							"PgLite",
							"Tauri",
							"Rust"
						]
					},
					{
						"id": "frontend-developer",
						"title": "Full-Stack Developer",
						"category": "professional",
						"startDate": "2024-12-27",
						"endDate": "2025-03-26",
						"employmentType": "Project Work",
						"icon": "code",
						"isExpanded": true,
						"description": [
							"Building polished web interfaces with React, Next.js, TypeScript, Tailwind CSS, and animation-focused UI patterns.",
							"Translating product ideas into responsive, accessible, and maintainable frontend experiences.",
							"Exploring backend technologies like Hono.js, AWS, etc."
						],
						"skills": [
							"Next.js",
							"React",
							"Tailwind CSS"
						]
					}
				]
			},
			{
				"id": "2",
				"companyName": "Artoon Solutions",
				"companyLogo": "/images/work-experience/artoon-logo.png",
				"positions": [
					{
						"id": "software-development",
						"title": "Frontend Developer",
						"category": "professional",
						"startDate": "2023-01-15",
						"endDate": "2024-11-20",
						"employmentType": "professional",
						"icon": "code",
						"isExpanded": true,
						"description": [
							"Practicing component architecture, responsive layouts, theme systems, and 3D canvas integration.",
							"Improving performance-minded frontend development habits through focused engineering practice.",
							"Implemented theme systems and responsive layouts inside game UIs, applying the same standards as production web apps.",
							"Worked with canvas and WebGL for 3D rendering, learning how browsers handle graphics at a lower level than typical UI work."
						],
						"skills": [
							"Typescript",
							"Games",
							"UI Architecture",
							"Three.js"
						]
					}
				]
			}
		]
	}$$::jsonb,
	$${
		"featureFlags": {
			"showIntroduction": true,
			"showWorkExperience": true
		}
	}$$::jsonb
)
ON CONFLICT ("key") DO UPDATE SET
	"content" = EXCLUDED."content",
	"config" = EXCLUDED."config",
	"is_active" = EXCLUDED."is_active",
	"updated_at" = now();
