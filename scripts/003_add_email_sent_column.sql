-- Add email_sent column to track which users have received emails
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_email_sent ON waitlist(email_sent);

-- Update existing records to mark them as not sent (so they get emails)
-- Only run this if you want to resend to everyone
-- UPDATE waitlist SET email_sent = FALSE WHERE email_sent IS NULL;