import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getUserFromAuthHeader } from "../libs/supabase.ts";
import { Hono } from "jsr:@hono/hono";

import { CORS_HEADERS } from "../consts.ts";
import { generateAuthURL } from "../libs/trello.ts";

const app = new Hono();

// TODO: awaiting saving integration details via POST requests
// app.post("/integration", async (c) => {
//   const { name } = await c.req.json();
//   return new Response(`Hello ${name}!`);
// });

// app.get("/integration/:type", (context) => {

app.get("/integration", async (context) => {
  try {
    const user = await getUserFromAuthHeader(context);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: CORS_HEADERS,
        status: 403,
      });
    }

    const url = {
      trello: generateAuthURL({
        redirectUrl: Deno.env.get("INTEGRATIONS_WEB_STORE") || "",
      }),
    };

    return new Response(JSON.stringify({ data: { url } }), {
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
