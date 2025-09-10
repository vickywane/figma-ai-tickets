import { createClient, User } from "https://esm.sh/@supabase/supabase-js@2";
import { type Context } from "jsr:@hono/hono";

// console.log({
//   url: Deno.env.get("SUPABASE_URL"),
//   key: Deno.env.get("SUPABASE_ANON_KEY"),
// });

export const createSupabaseClient = (context: Context) =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    // {
    //   global: {
    //     headers: {
    //       Authorization: context.req.header("Authorization") ?? "",
    //     },
    //   },
    // }
  );

export const getUserFromAuthHeader = async (
  context: Context
): Promise<User | null> => {
  try {
    const authorization = context.req.header("Authorization");

    if (!authorization) {
      throw new Error("Authorization header is missing");
    }

    const token = authorization?.replace("Bearer ", "");

    console.log("TOKEN =>", token)

    if (!token) {
      throw new Error("Token is missing from auth header");
    }

    const supabase = createSupabaseClient(context);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    return user;
  } catch (error) {
    console.error("Error getting user from auth header:", error);

    return null;
  }
};
