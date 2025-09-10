-- Add university column to track user institutions and reach
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS university TEXT;

-- Add name column if it doesn't exist (for backward compatibility)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Create index for university queries
CREATE INDEX IF NOT EXISTS idx_waitlist_university ON waitlist(university);
