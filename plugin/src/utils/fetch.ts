const SUPABASE_API_URL = import.meta.env.VITE_PUBLIC_SUPABASE_API_URL;
const API_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_API_KEY;

type FetchClient = {
  data: Record<string, string>;
  method?: "POST" | "GET";
};

export const fetchClient = async (
  endpoint: string,
  { data, method = "GET" }: FetchClient
) => {
  try {
    const request = await fetch(`${SUPABASE_API_URL}/${endpoint}`, {
      method,
      body: data && JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};
