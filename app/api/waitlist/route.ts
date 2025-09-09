import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/waitlist - Starting request")

    const { email, referralSource, sportsInterests } = await request.json()
    console.log("[v0] Request data:", { email: email ? "provided" : "missing", referralSource, sportsInterests })

    // Validate email
    if (!email || !email.includes("@")) {
      console.log("[v0] Email validation failed")
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client")
    const supabase = await createClient()

    console.log("[v0] Attempting to insert into waitlist_signups table")

    // Insert into waitlist_signups
    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert({
        email: email.toLowerCase().trim(),
        referral_source: referralSource || null,
        sports_interests: sportsInterests || [],
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Supabase insert error:", error)
      // Handle duplicate email
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already registered for waitlist" }, { status: 409 })
      }

      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
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

// Get waitlist stats (public endpoint)
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
    // Select from waitlist_signups
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
