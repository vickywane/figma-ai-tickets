import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getUserFromAuthHeader } from "../libs/supabase.ts";
import { Hono } from "jsr:@hono/hono";

import { CORS_HEADERS } from "../consts.ts";
import { generateTrelloAuthURL } from "../libs/trello.ts";
import { generateLinearAuthURL } from "../libs/linear.ts";

const app = new Hono();

app.get("/integration", async (context) => {
  const redirectUrl = Deno.env.get("INTEGRATIONS_WEB_STORE");

  if (!redirectUrl) {
    throw new Error("INTEGRATIONS_WEB_STORE environment missing");
  }

  try {
    const user = await getUserFromAuthHeader(context);

    if (!user) {
      return new Response(JSON.stringify({ eror: "Unauthorized" }), {
        headers: CORS_HEADERS,
        status: 403,
      });
    }

    const url = {
      trello: generateTrelloAuthURL({
        redirectUrl,
      }),
      linear: generateLinearAuthURL({
        redirectUrl,
      }),
    };

    return new Response(JSON.stringify({ url }), {
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
