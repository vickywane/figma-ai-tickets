import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from "../consts.ts";
import { generateAuthURL } from "../libs/trello.ts";

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    const searchParams = new URL(req.url).searchParams;
    const type = searchParams.get("type");

    if (!type) {
      return new Response(JSON.stringify({ error: "Type is required" }), {
        headers: CORS_HEADERS,
        status: 400,
      });
    }

    let url = "";

    switch (type) {
      case "trello": {
        url = generateAuthURL({
          redirectUrl: Deno.env.get("INTEGRATIONS_WEB_STORE") || ""
        });
      }
    }

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
