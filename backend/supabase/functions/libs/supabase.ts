import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const createSupabaseClient = () =>
  createClient(
    Deno.env.get("CUSTOM_SUPABASE_URL")!,
    Deno.env.get("CUSTOM_SUPABASE_ANON_KEY")!
  );
