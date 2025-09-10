import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[Supabase] Missing environment variables")
    // Return a mock client that will fail gracefully
    return {
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: new Error("Supabase not configured") })
          })
        }),
        select: () => ({
          count: () => ({ count: 0, error: new Error("Supabase not configured") })
        })
      })
    } as any
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}