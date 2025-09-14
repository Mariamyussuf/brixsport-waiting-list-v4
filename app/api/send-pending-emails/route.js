import { sendPendingEmails } from '@/scripts/send-pending-emails';

export async function GET(request) {
  // Check for secret in query parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;
  
  // More robust secret validation
  console.log('=== Secret Validation Debug ===');
  console.log('Raw secret from URL:', secret);
  console.log('CRON_SECRET from env:', expectedSecret);
  console.log('Environment variable exists:', !!process.env.CRON_SECRET);
  
  // Handle case where environment variable is not set
  if (!process.env.CRON_SECRET) {
    console.error('CRON_SECRET environment variable is not set!');
    return new Response(
      JSON.stringify({ 
        error: 'Server configuration error: CRON_SECRET not set',
        details: 'The CRON_SECRET environment variable is not configured on the server'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Handle missing secret in request
  if (!secret) {
    console.log('No secret provided in request');
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Missing secret parameter' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Decode the secret and compare
  let decodedSecret;
  try {
    decodedSecret = decodeURIComponent(secret);
    console.log('Decoded secret:', decodedSecret);
  } catch (decodeError) {
    console.error('Error decoding secret:', decodeError);
    return new Response(
      JSON.stringify({ error: 'Invalid secret encoding' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Verify the secret
  if (decodedSecret !== expectedSecret) {
    console.log('Secret mismatch!');
    console.log('- Provided (decoded):', decodedSecret);
    console.log('- Expected:', expectedSecret);
    console.log('- Length match:', decodedSecret.length === expectedSecret.length);
    
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid secret' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  console.log('Secret validation successful, proceeding with email sending...');
  
  try {
    const result = await sendPendingEmails();
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-pending-emails API route:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request) {
  return GET(request);
}