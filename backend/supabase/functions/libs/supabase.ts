import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CORS_HEADERS } from "../consts.ts";

export const createSupabaseClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

export const getUserFromAuthHeader = async (context) => {
  try {
    const authorization = context.req.header("Authorization");

    if (!authorization) {
      throw new Error("Authorization header is missing");
    }

    const supabase = createSupabaseClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(authorization?.replace("Bearer ", ""));

    if (error) {
      return new Response(
        JSON.stringify({
          message: "err getting user from auth headers",
          error,
        }),
        {
          headers: CORS_HEADERS,
          status: 403,
        }
      );
    }

    return user;
  } catch (error) {
    console.error("Error getting user from auth header:", error);
  }
};
