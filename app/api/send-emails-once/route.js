import { sendFirst100Emails } from '@/scripts/send-first-100';

export async function GET(request) {
  // Check for authorization header or other security measures
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.CRON_AUTH_TOKEN || 'your_random_secure_token_here_12345';
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  try {
    const result = await sendFirst100Emails();
    
    // If no emails were sent, return a different message
    if (result && result.sent === 0 && result.total === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found to email or all users already emailed', success: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
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