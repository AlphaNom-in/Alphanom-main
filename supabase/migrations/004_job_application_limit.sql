-- Add application limit and auto-pause tracking to job_posts
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS application_limit integer,
  ADD COLUMN IF NOT EXISTS auto_paused boolean NOT NULL DEFAULT false;
