import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseClient } from "../libs/supabase.ts";
import { Hono, type Context } from "jsr:@hono/hono";

import { CORS_HEADERS } from "../consts.ts";

const app = new Hono();

app.options("/waitlist", () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
});

app.post("/waitlist", async (context: Context) => {
  try {
    const body = await context.req.json();

    if (!body.email) {
      return new Response(
        JSON.stringify({ error: "missing required email field" }),
        {
          headers: CORS_HEADERS,
          status: 400,
        }
      );
    }

    const supabase = createSupabaseClient(context);

    const { data, error } = await supabase.from("waitlist").insert({
      email: body.email,
      feedback: body.feedback || null,
    });

    if (error) {
      console.error(error)
      
      return new Response(JSON.stringify({ error }), {
        headers: CORS_HEADERS,
      });
    }

    return new Response(JSON.stringify({ data : "entry saved" }), {
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Err generating integration url:", error);

    return new Response(JSON.stringify({ error }), {
      headers: CORS_HEADERS,
      status: 400,
    });
  }
});

Deno.serve(app.fetch);
