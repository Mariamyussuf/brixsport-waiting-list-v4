const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Load environment variables
require('dotenv').config();

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendBulkEmails() {
  try {
    console.log('Starting bulk email sending process...');
    
    // Check if Resend is configured
    if (!resend) {
      console.error('Resend is not configured. Please set RESEND_API_KEY in your environment variables.');
      process.exit(1);
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
      process.exit(1);
    }

    // Create Supabase client with service role key for full access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Fetch all waitlist entries
    console.log('Fetching waitlist entries...');
    const { data: waitlistEntries, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching waitlist entries:', error);
      process.exit(1);
    }

    console.log(`Found ${waitlistEntries?.length || 0} waitlist entries.`);
    
    if (!waitlistEntries || waitlistEntries.length === 0) {
      console.log('No waitlist entries found.');
      process.exit(0);
    }

    // Email template
    const emailTemplate = (name) => `Hi ${name},

Thank you for joining the Brixsports waitlist! We're excited to have you on board.

With Brixsports, matches are stories. Stats are tied to your campus, your players, your rivalries. The meaning is amplified because the community already knows the people on the field.

Brixsports' match feed isn't about passively 'checking scores' like Livescores. It's about living the match in real time inside your campus bubble, powered by people who are actually there.

We'll be in touch soon with updates on our launch.

Best regards,
The Brixsports Team`;

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
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}:`, error);
        errorCount++;
      }
    }

    console.log(`
📧 Bulk email sending completed!
✅ Successful: ${successCount}
❌ Failed: ${errorCount}
📊 Total: ${waitlistEntries.length}
`);
    
  } catch (error) {
    console.error('Error in bulk email sending process:', error);
    process.exit(1);
  }
}

// Run the function
sendBulkEmails();