import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  createSupabaseClient,
  getUserFromAuthHeader,
} from "../libs/supabase.ts";
import { Hono, type Context } from "jsr:@hono/hono";

import { CORS_HEADERS } from "../consts.ts";
import { exchangeCode } from "../libs/linear.ts";

const app = new Hono();

app.post("/callback", async (context: Context) => {
  try {
    const redirectUrl = Deno.env.get("INTEGRATIONS_WEB_STORE");

    if (!redirectUrl) {
      throw new Error("INTEGRATIONS_WEB_STORE env var missing");
    }

    const user = await getUserFromAuthHeader(context);
    const supabase = createSupabaseClient(context);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: CORS_HEADERS,
        status: 403,
      });
    }

    const body = await context.req.json();

    if (!body.token) {
      return new Response(JSON.stringify({ error: "Callback missing token" }), {
        headers: CORS_HEADERS,
        status: 400,
      });
    }

    const exchangeData = await exchangeCode({
      code: body.token,
      redirectUri: redirectUrl,
    });

    const { data, error } = await supabase
      .from("integrations")
      .insert({
        name: "Linear",
        created_by: user.id,
        tokens: JSON.stringify(exchangeData),
      })
      .select("*")
      .single();

    if (error) {
      console.error("Err saving callback:", error);

      return new Response(JSON.stringify({ error }), {
        headers: CORS_HEADERS,
        status: 500,
      });
    }

    return new Response(JSON.stringify({ data }), {
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
