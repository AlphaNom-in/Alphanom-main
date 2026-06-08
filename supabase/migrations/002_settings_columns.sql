-- Run in Supabase SQL editor

-- Employer: job posting defaults
ALTER TABLE employers
  ADD COLUMN IF NOT EXISTS default_work_model      text,
  ADD COLUMN IF NOT EXISTS default_notice_period   text,
  ADD COLUMN IF NOT EXISTS default_commission_pct  numeric(5,2);

-- Recruiter: payout / banking details
ALTER TABLE recruiters
  ADD COLUMN IF NOT EXISTS bank_account_name   text,
  ADD COLUMN IF NOT EXISTS bank_account_number text,
  ADD COLUMN IF NOT EXISTS bank_ifsc           text,
  ADD COLUMN IF NOT EXISTS upi_id              text,
  ADD COLUMN IF NOT EXISTS pan_number          text,
  ADD COLUMN IF NOT EXISTS gst_number          text;