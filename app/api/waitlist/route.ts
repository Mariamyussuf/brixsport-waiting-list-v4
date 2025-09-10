import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sending function
async function sendConfirmationEmail(email: string, name: string) {
  const emailContent = `Hi ${name},

Thank you for joining the Brixsports waitlist! We're excited to have you on board.

With Brixsports, matches are stories. Stats are tied to your campus, your players, your rivalries. The meaning is amplified because the community already knows the people on the field.

Brixsports' match feed isn't about passively 'checking scores' like Livescores. It's about living the match in real time inside your campus bubble, powered by people who are actually there.

We'll be in touch soon with updates on our launch.

Best regards,
The Brixsports Team`;

  try {
    const data = await resend.emails.send({
      from: 'Brixsports <welcome@brixsports.com>',
      to: [email],
      subject: 'Welcome to Brixsports Waitlist!',
      text: emailContent,
    });
    
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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
        sports_interests: sportsInterests || [],
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Supabase insert error:", error)
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already registered for waitlist" }, { status: 409 })
      }

      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, name);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email sending fails
    }

    console.log("[v0] Successfully inserted data:", data)
    return NextResponse.json(
      {
        message: "Successfully joined waitlist!",
        id: data.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
      console.error("[v0] Missing Supabase environment variables")
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Creating Supabase client for GET")
    const supabase = await createClient()

    console.log("[v0] Attempting to count waitlist_signups")
    const { count, error } = await supabase.from("waitlist_signups").select("*", { count: "exact", head: true })

    if (error) {
      console.error("[v0] Supabase count error:", error)
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
