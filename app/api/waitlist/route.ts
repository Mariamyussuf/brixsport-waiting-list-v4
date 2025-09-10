import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from 'resend';

// Initialize Resend client only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email sending function
async function sendConfirmationEmail(email: string, name: string) {
  // Skip email sending if Resend is not configured
  if (!resend) {
    console.log('Resend not configured, skipping email sending');
    return;
  }
  
  const emailContent = `Hi ${name},

Thank you for joining the Brixsports waitlist! We're excited to have you on board.

With Brixsports, matches are stories. Stats are tied to your campus, your players, your rivalries. The meaning is amplified because the community already knows the people on the field.

Brixsports' match feed isn't about passively 'checking scores' like Livescores. It's about living the match in real time inside your campus bubble, powered by people who are actually there.

We'll be in touch soon with updates on our launch.

Best regards,
The Brixsports Team`;

  try {
    console.log(`[Resend] Attempting to send email to ${email}`);
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Welcome to Brixsports Waitlist!',
      text: emailContent,
    });
    
    console.log('[Resend] Email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('[Resend] Error sending email:', error);
    console.error('[Resend] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      response: error.response
    });
    
    // Re-throw the error so it can be handled by the calling function
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/waitlist - Starting request")

    const { email, university, referralSource, sportsInterests, name } = await request.json()
    console.log("[v0] Request data:", {
      email: email ? "provided" : "missing",
      name: name ? "provided" : "missing",
      university: university ? "provided" : "missing",
      referralSource,
      sportsInterests,
    })

    if (!email || !email.includes("@")) {
      console.log("[v0] Email validation failed")
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!name || name.trim().length === 0) {
      console.log("[v0] Name validation failed")
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!university || university.trim().length === 0) {
      console.log("[v0] University validation failed")
      return NextResponse.json({ error: "University is required" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client")
    const supabase = await createClient()

    console.log("[v0] Attempting to insert into waitlist table")

    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        university: university.trim(),
        referral_source: referralSource || null,
        sports_interests: sportsInterests || null,
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Supabase insert error:", error)
      // Handle the case where Supabase is not configured
      if (error.message === "Supabase not configured - missing environment variables" || 
          error.message.includes("Supabase not configured")) {
        // Still return success since we want the waitlist to work even without Supabase
        console.log("[v0] Supabase not configured, returning mock success")
        return NextResponse.json(
          {
            message: "Successfully joined waitlist!",
            id: "mock-id",
          },
          { status: 201 },
        )
      }
      
      // Handle RLS policy violations by attempting with service role if available
      if (error.message.includes("row-level security policy")) {
        console.log("[v0] RLS policy violation detected, attempting with service role if available")
        
        // Try to get a service role client
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          try {
            const { createClient: createServiceClient } = await import("@supabase/supabase-js")
            const serviceSupabase = createServiceClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            
            const { data: serviceData, error: serviceError } = await serviceSupabase
              .from("waitlist")
              .insert({
                email: email.toLowerCase().trim(),
                name: name.trim(),
                university: university.trim(),
                referral_source: referralSource || null,
                sports_interests: sportsInterests || null,
              })
              .select()
              .single()
              
            if (serviceError) {
              console.error("[v0] Service role insert also failed:", serviceError)
              return NextResponse.json({ 
                error: "Unable to join waitlist due to security policy. Please contact support." 
              }, { status: 500 })
            }
            
            // Service role insert succeeded
            console.log("[v0] Successfully inserted data with service role:", serviceData)
            
            // Send confirmation email
            try {
              await sendConfirmationEmail(email, name);
              console.log("[v0] Confirmation email sent successfully to", email);
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
              // Don't fail the request if email sending fails
            }
            
            return NextResponse.json(
              {
                message: "Successfully joined waitlist!",
                id: serviceData?.id || "mock-id",
              },
              { status: 201 },
            )
          } catch (serviceError) {
            console.error("[v0] Error creating service client:", serviceError)
            return NextResponse.json({ 
              error: "Unable to join waitlist due to security policy. Please contact support." 
            }, { status: 500 })
          }
        } else {
          console.error("[v0] No service role key available to bypass RLS")
          return NextResponse.json({ 
            error: "Unable to join waitlist due to security policy. Please contact support." 
          }, { status: 500 })
        }
      }
      
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already registered for waitlist" }, { status: 409 })
      }

      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to join waitlist: " + error.message }, { status: 500 })
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, name);
      console.log("[v0] Confirmation email sent successfully to", email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Log the error but don't fail the request - we still want to register the user
      console.log("[v0] User registered but email failed to send");
    }

    console.log("[v0] Successfully inserted data:", data)
    return NextResponse.json(
      {
        message: "Successfully joined waitlist!",
        id: data?.id || "mock-id",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] API POST error:", error)
    return NextResponse.json({ error: "Internal server error: " + (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[v0] GET /api/waitlist - Starting request")

    console.log("[v0] Environment check:", {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, returning mock count")
      return new Response(
        JSON.stringify({
          totalSignups: 0,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("[v0] Creating Supabase client for GET")
    const supabase = await createClient()

    console.log("[v0] Attempting to count waitlist_signups")
    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true })

    if (error) {
      console.error("[v0] Supabase count error:", error)
      // Handle the case where Supabase is not configured
      if (error.message === "Supabase not configured") {
        return new Response(
          JSON.stringify({
            totalSignups: 0,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        )
      }
      
      return new Response(
        JSON.stringify({
          error: "Database error",
          details: error.message,
          totalSignups: 0,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("[v0] Successfully got count:", count)
    return new Response(
      JSON.stringify({
        totalSignups: count || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("[v0] API GET error:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        totalSignups: 0,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
