-- Add university column to track user institutions and reach
ALTER TABLE waitlist_signups 
ADD COLUMN university TEXT;

-- Create index for university queries
CREATE INDEX IF NOT EXISTS idx_waitlist_university ON waitlist_signups(university);
