import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { extractDetails } from "../libs/openai.ts";
import { CORS_HEADERS } from "../consts.ts";
import {
  createSupabaseClient,
  getUserFromAuthHeader,
} from "../libs/supabase.ts";
import { retrieveTaskBoards } from "../libs/trello.ts";

import { Hono, type Context } from "jsr:@hono/hono";

const app = new Hono();

app.post("/generate-task", async (context: Context) => {
  try {
    console.log("FIRED")

    const body = await context.req.json();

    if (!body.image || !body.integration) {
      return new Response(
        JSON.stringify({ error: "image or user in request body" }),
        {
          headers: CORS_HEADERS,
          status: 400,
        }
      );
    }

    const supabase = createSupabaseClient(context);
    const user = await getUserFromAuthHeader(context);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: CORS_HEADERS,
        status: 403,
      });
    }

    // // TODO: explore getting user from the session.
    const { data, error } = await supabase
      .schema("public")
      .from("integrations")
      .select("*")
      .eq("created_by", user?.id);

    console.log(data);

    if (error) {
      console.error("Error getting integrations:", error);

      return new Response(JSON.stringify({ error }), {
        headers: CORS_HEADERS,
        status: 500,
      });
    }

    // TODO: await support for multiple integrations.
    const targetIntegration = data?.find(
      (integration) => integration.name === body.integration
    );

    if (!targetIntegration) {
      return new Response(
        JSON.stringify({ error: "Trello integration not found" }),
        {
          headers: CORS_HEADERS,
          status: 404,
        }
      );
    }

    // const boardList = await retrieveTaskBoards(
    //   targetIntegration?.board,
    //   targetIntegration?.tokens
    // );
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

    // return new Response(JSON.stringify({ data: { ...object, boardList } }), {
    //   headers: CORS_HEADERS,
    // });

    return new Response(JSON.stringify({ data: { ...object } }), {
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

Deno.serve(app.fetch);
