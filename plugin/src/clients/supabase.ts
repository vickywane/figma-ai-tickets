import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_API_KEY;

export const createSupbaseClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_API_KEY, {
    auth: {
      debug: false,
    },
  });
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
