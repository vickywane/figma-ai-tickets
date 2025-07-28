import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CORS_HEADERS } from "../consts.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Err signing in user:", error);

      return new Response(JSON.stringify(error), {
        headers: CORS_HEADERS,
        status: 403,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: CORS_HEADERS,
    });
  } catch (e) {
    console.error("Err signing user:", e);

    return new Response(JSON.stringify({ error: e }), {
      headers: CORS_HEADERS,
      status: 400,
    });
  }
});
