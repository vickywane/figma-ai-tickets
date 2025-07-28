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

    const { email, password, name } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
      },
    });

    if (error) {
      console.error("Err creating user:", error);

      return new Response(JSON.stringify(error), {
        headers: CORS_HEADERS,
        status: 400,
      });
    }

    return new Response(JSON.stringify({ data }), {
      headers: CORS_HEADERS,
    });
  } catch (e) {
    console.error("Err creating user:", e);

    return new Response(JSON.stringify({ error: e }), {
      headers: CORS_HEADERS,
      status: 400,
    });
  }
});
