-- Run this in your Supabase SQL editor once

CREATE TABLE IF NOT EXISTS submission_feedback (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES candidate_submissions(id) ON DELETE CASCADE,
  employer_id   uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  status_at_time text NOT NULL,
  feedback_text  text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE submission_feedback ENABLE ROW LEVEL SECURITY;

-- Employers can insert feedback for submissions on their own jobs
CREATE POLICY "employer_insert_feedback" ON submission_feedback
  FOR INSERT TO authenticated
  WITH CHECK (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  );

-- Recruiters can read feedback for their own candidate submissions
CREATE POLICY "recruiter_read_feedback" ON submission_feedback
  FOR SELECT TO authenticated
  USING (
    submission_id IN (
      SELECT id FROM candidate_submissions
      WHERE recruiter_id IN (SELECT id FROM recruiters WHERE user_id = auth.uid())
    )
  );