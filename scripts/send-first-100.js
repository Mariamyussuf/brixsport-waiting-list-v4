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

async function sendFirst100Emails() {
  try {
    console.log('Starting email sending process for first 100 users...');
    
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
    
    // Fetch the first 100 waitlist entries that haven't been emailed yet, ordered by creation date
    console.log('Fetching first 100 waitlist entries that haven\'t been emailed...');
    const { data: waitlistEntries, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email_sent', false)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching waitlist entries:', error);
      return { success: false, error: error.message };
    }

    console.log(`Found ${waitlistEntries?.length || 0} waitlist entries.`);
    
    if (!waitlistEntries || waitlistEntries.length === 0) {
      console.log('No waitlist entries found.');
      return { success: true, message: 'No users found to email', sent: 0, failed: 0, total: 0 };
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
        
        // Mark user as emailed in the database
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
📧 Email sending completed for first 100 users!
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
    console.error('Error in email sending process:', error);
    return { success: false, error: error.message };
  }
}

// Run the function
if (require.main === module) {
  sendFirst100Emails().then(result => {
    console.log('Script execution result:', result);
    if (!result.success) {
      process.exit(1);
    }
    process.exit(0);
  });
}