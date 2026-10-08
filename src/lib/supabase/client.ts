import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hmwzjulepzewbuyyyfhp.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_xn1cSCfxmW3VrFE9M8FnLA_BSmC6JJK";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
