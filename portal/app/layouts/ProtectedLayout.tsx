import { Outlet, redirect, data } from "react-router";
import { createServerClient } from "../lib/supabase/server";

function extractSearchParams(url: string) {
  try {
    const urlObj = new URL(url);
    const params: any = {};

    for (const [key, value] of urlObj.searchParams) {
      params[key] = value;
    }

    return params;
  } catch (error) {
    console.error("Invalid URL:", error);
    return {};
  }
}

export async function loader({ request }) {
  const { supabase, headers } = createServerClient(request);
  const urlData = extractSearchParams(request.url);

  await supabase.auth.getClaims();

  if (urlData.access_token && urlData.refresh_token) {
    await supabase.auth.setSession({
      refresh_token: urlData.refresh_token,
      access_token: urlData.access_token,
    });

    return data(null, { headers });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/");
  }
}

export default function ProtectedLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
