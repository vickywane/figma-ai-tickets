import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { extractDetails } from "../libs/openai.ts";
import { CORS_HEADERS } from "../consts.ts";
import { createSupabaseClient } from "../libs/supabase.ts";
import { retrieveTaskBoards } from "../libs/trello.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await req.json();

    if (!body.image || !body.user) {
      return new Response(
        JSON.stringify({ error: "image or user in request body" }),
        {
          headers: CORS_HEADERS,
          status: 400,
        }
      );
    }

    const supabase = createSupabaseClient();

    // TODO: explore getting user from the session.
    const queryData = await supabase
      .schema("public")
      .from("integrations")
      .select("*")
      .eq("created_by", body.user);

    const { data, error: queryError } = queryData;

    if (queryError) {
      console.error("Error getting integrations:", queryError);

      return new Response(JSON.stringify({ error: queryError }), {
        headers: CORS_HEADERS,
        status: 500,
      });
    }

    // TODO: await support for multiple integrations.
    const trelloIntegration = data?.find((integration) => integration.name === "Trello");

    if (!trelloIntegration) {
      return new Response(
        JSON.stringify({ error: "Trello integration not found" }),
        {
          headers: CORS_HEADERS,
          status: 404,
        }
      );
    }

    const boardList = await retrieveTaskBoards(trelloIntegration?.board, trelloIntegration?.tokens);
    const object = await extractDetails(body?.image);

    if (!object) {
      return new Response(
        JSON.stringify({
          error: `model failed to extract details from element`,
        }),
        {
          headers: CORS_HEADERS,
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ data: {...object, boardList} }), {
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Failed to extract data:", error);

    return new Response(JSON.stringify({ error }), {
      headers: CORS_HEADERS,
      status: 400,
    });
  }
});