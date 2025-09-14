import { sendPendingEmails } from '@/scripts/send-pending-emails';

export async function GET(request) {
  // Check for secret in query parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;
  
  // Verify the secret (decode URI component to handle special characters)
  if (!secret || !expectedSecret || decodeURIComponent(secret) !== expectedSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid or missing secret' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
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