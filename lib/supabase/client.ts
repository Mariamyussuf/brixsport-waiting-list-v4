import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[Supabase] Missing environment variables")
    // Return a mock client that will fail gracefully
    return {
      from: (table: string) => ({
        insert: (data: any) => ({
          select: () => ({
            single: () => ({ data: null, error: new Error("Supabase not configured - missing environment variables") })
          })
        }),
        select: (columns?: string) => ({
          count: (options?: any) => ({ count: 0, error: new Error("Supabase not configured - missing environment variables") }),
          head: (isHead: boolean) => ({ count: 0, error: new Error("Supabase not configured - missing environment variables") })
        })
      })
    } as any
  }

  try {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  } catch (error) {
    console.error("[Supabase] Error creating client:", error)
    // Return a mock client that will fail gracefully
    return {
      from: (table: string) => ({
        insert: (data: any) => ({
          select: () => ({
            single: () => ({ data: null, error: new Error("Supabase client initialization failed: " + (error as Error).message) })
          })
        }),
        select: (columns?: string) => ({
          count: (options?: any) => ({ count: 0, error: new Error("Supabase client initialization failed: " + (error as Error).message) }),
          head: (isHead: boolean) => ({ count: 0, error: new Error("Supabase client initialization failed: " + (error as Error).message) })
        })
      })
    } as any
  }
}