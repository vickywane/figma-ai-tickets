import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /**
   * Do not run code between createServerClient and supabase.auth.getClaims(). 
   * It's very hard to debug and causes users being randomly logged out. If you remove getClaims() and you use server-side rendering
   * with the Supabase client, your users may be randomly logged out.
   */

  // NOTE: removing `getClaims()`  causes supabase not to persist auth state
  await supabase.auth.getClaims();

  const url = request.nextUrl;
  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  if (access_token && refresh_token) {
    await supabase.auth.setSession({
      refresh_token,
      access_token,
    });

    // TODO: clean up the URL after setting the session & remove the tokens
    // const url = request.nextUrl.clone()
    // url.pathname = '/boy'
    // url.search = ''
    // NextResponse.redirect(url)
  }

  // refreshing the auth token
  await supabase.auth.getUser();

  return supabaseResponse;
}
