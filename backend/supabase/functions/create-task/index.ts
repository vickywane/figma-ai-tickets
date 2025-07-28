import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { extractDetails } from "../libs/openai.ts";
import { CORS_HEADERS } from "../consts.ts";
import { createSupabaseClient } from "../libs/supabase.ts";
import { createTask, retrieveTaskBoards } from "../libs/trello.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    const { columnId, title, user, message } = await req.json();
    const supabase = createSupabaseClient();

    const queryData = await supabase
      .schema("public")
      .from("integrations")
      .select("*")
      .eq("created_by", user);

    const { data, error: queryError } = queryData;

    if (queryError) {
      console.error("Error getting integrations:", queryError);

      return new Response(JSON.stringify({ error: queryError }), {
        headers: CORS_HEADERS,
        status: 500,
      });
    }

    const trelloIntegration = data?.find((integration) => integration.name === "Trello");

    const createdTask = await createTask({
      listId: columnId,
      title,
      content: message,
      token: trelloIntegration.tokens,
    })

    return new Response(JSON.stringify({ data: createdTask }), {
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