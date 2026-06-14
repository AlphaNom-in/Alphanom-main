-- Run in Supabase SQL editor
-- Preserves candidate_submissions when a recruiter account is deleted

-- 1. Add preservation columns
ALTER TABLE candidate_submissions
  ADD COLUMN IF NOT EXISTS recruiter_deleted       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recruiter_name_snapshot text;

-- 2. Back-fill snapshot name for all existing submissions
UPDATE candidate_submissions cs
SET    recruiter_name_snapshot = r.full_name
FROM   recruiters r
WHERE  cs.recruiter_id = r.id
AND    cs.recruiter_name_snapshot IS NULL;

-- 3. Ensure recruiter_id is nullable so we can SET NULL when recruiter is deleted
--    (safe no-op if it's already nullable)
ALTER TABLE candidate_submissions
  ALTER COLUMN recruiter_id DROP NOT NULL;
