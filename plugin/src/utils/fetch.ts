import { API_KEY, BASE_API_URL } from "../../env";

type FetchClient = {
  data: Record<string, string>;
  method?: "POST" | "GET";
};

export const fetchClient = async (
  endpoint: string,
  { data, method = "GET" }: FetchClient
) => {
  try {
    const request = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method,
      body: data && JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (error) {
    console.error(`network err : ${error}`);
  }
};
