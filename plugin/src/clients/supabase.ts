import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from "../../env";

let client: SupabaseClient | null = null;

export const createSupbaseClient = () => {
  if (client) {
    return client;
  }

  client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      debug: false,
    },
  });

  return client;
};

export const getUserIntegrations = async (userId: string) => {
  try {
    const supabase = createSupbaseClient();

    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("created_by", userId);

    if (error) {
      console.error("Error fetching user integrations:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error in getUserIntegrations:", error);

    return [];
  }
};
