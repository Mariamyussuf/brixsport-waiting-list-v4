require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email template
const emailTemplate = (name) => `Hi ${name},

Thank you for joining the Brixsports waitlist! We're excited to have you on board.

With Brixsports, matches are stories. Stats are tied to your campus, your players, your rivalries. The meaning is amplified because the community already knows the people on the field.

Brixsports' match feed isn't about passively 'checking scores' like Livescores. It's about living the match in real time inside your campus bubble, powered by people who are actually there.

We'll be in touch soon with updates on our launch.

Best regards,
The Brixsports Team`;

async function sendPendingEmails() {
  try {
    console.log('Starting pending email sending process...');
    
    // Check if Resend is configured
    if (!resend) {
      console.error('Resend is not configured. Please set RESEND_API_KEY in your environment variables.');
      return { success: false, error: 'Resend not configured' };
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
      return { success: false, error: 'Supabase not configured' };
    }

    // Create Supabase client with service role key for full access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Fetch waitlist entries that haven't received emails yet
    // We'll use a simple approach: find entries without an 'email_sent' field or with email_sent = false
    console.log('Fetching pending waitlist entries...');
    
    // First, let's add an email_sent column if it doesn't exist
    try {
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE`
      });
      
      if (alterError) {
        console.log('Note: Could not add email_sent column (may already exist or no permissions)', alterError.message);
      }
    } catch (e) {
      console.log('Note: Could not add email_sent column (RPC not available)', e.message);
    }
    
    // Fetch entries that haven't had emails sent
    let { data: waitlistEntries, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email_sent', false)
      .order('created_at', { ascending: true });

    // If the email_sent column doesn't exist or the query fails, fetch all entries
    if (error) {
      console.log('Fetching all entries (email_sent column may not exist):', error.message);
      const result = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: true });
      
      waitlistEntries = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching waitlist entries:', error);
      return { success: false, error: error.message };
    }

    console.log(`Found ${waitlistEntries?.length || 0} pending waitlist entries.`);
    
    if (!waitlistEntries || waitlistEntries.length === 0) {
      console.log('No pending waitlist entries found.');
      return { success: true, message: 'No pending entries' };
    }

    // Send emails with a delay to avoid rate limiting
    let successCount = 0;
    let errorCount = 0;

    for (const [index, entry] of waitlistEntries.entries()) {
      try {
        console.log(`Sending email to ${entry.email} (${index + 1}/${waitlistEntries.length})...`);
        
        // Send email
        const data = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: [entry.email],
          subject: 'Welcome to Brixsports Waitlist!',
          text: emailTemplate(entry.name || 'there'),
        });
        
        console.log(`✅ Email sent successfully to ${entry.email}`);
        successCount++;
        
        // Update the record to mark email as sent (if email_sent column exists)
        try {
          const { error: updateError } = await supabase
            .from('waitlist')
            .update({ email_sent: true })
            .eq('id', entry.id);
          
          if (updateError) {
            console.log(`Note: Could not update email_sent status for ${entry.email}`, updateError.message);
          }
        } catch (updateError) {
          console.log(`Note: Could not update email_sent status for ${entry.email}`, updateError.message);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}:`, error);
        errorCount++;
      }
    }

    console.log(`
📧 Pending email sending completed!
✅ Successful: ${successCount}
❌ Failed: ${errorCount}
📊 Total: ${waitlistEntries.length}
`);
    
    return { 
      success: true, 
      sent: successCount, 
      failed: errorCount, 
      total: waitlistEntries.length 
    };
    
  } catch (error) {
    console.error('Error in pending email sending process:', error);
    return { success: false, error: error.message };
  }
}

// If run directly, execute the function
if (require.main === module) {
  sendPendingEmails().then(result => {
    console.log('Script execution result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { sendPendingEmails };