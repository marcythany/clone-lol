-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ranked_info jsonb,
ADD COLUMN IF NOT EXISTS mastery_score jsonb,
ADD COLUMN IF NOT EXISTS challenges jsonb;
