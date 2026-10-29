-- Local development only. Run manually against a local ibi database.
-- The single retained frontend sample: Startup Academy: Zero to MVP.
INSERT INTO programs (category, status, title_az, title_en, description_az, description_en,
                      duration_az, duration_en, audience_az, audience_en,
                      deadline_az, deadline_en, icon, created_at, updated_at)
SELECT 'education', 'active', 'Startap Akademiyası: 0-dan MVP-yə',
       'Startup Academy: Zero to MVP',
       'İdeyanın doğrulanması, biznes model kətanı, maliyyə planlaması və prototipləmə əsaslarını əhatə edən praktiki modul təlimləri.',
       'Hands-on modular workshops covering idea validation, business model canvas, financial projections, and rapid prototyping.',
       '6 Həftə', '6 Weeks', 'Bütün Fakültələrin Tələbələri', 'All University Students',
       'Davam edir', 'In Progress', 'graduation-cap', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM programs WHERE title_az = 'Startap Akademiyası: 0-dan MVP-yə'
);
