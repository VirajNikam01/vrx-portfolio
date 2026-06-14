UPDATE "content_configs"
SET
	"config" = $${
		"featureFlags": {
			"showIntroduction": true,
			"showWorkExperience": true
		}
	}$$::jsonb,
	"updated_at" = now()
WHERE "key" = 'landing-page';
