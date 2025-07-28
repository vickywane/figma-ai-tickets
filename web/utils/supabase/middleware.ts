import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const access_token = request.nextUrl.searchParams.get("access_token");
  const refresh_token = request.nextUrl.searchParams.get("refresh_token");
  // const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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

  // console.log(
  //   "COOKIE ->", cookieStore.get("sb-paxlhoeizbkwcsuqlcun-auth-token")
  // )

  const tokens = request.nextUrl
    .clone()
    .pathname.split("/")
    .filter((val) => val);

  // console.log("URL", tokens);

  // if (access_token && refresh_token) {
  if (tokens && tokens[0] && tokens[1]) {
    const session = await supabase.auth.setSession({
      refresh_token: tokens[1],
      access_token: tokens[0],
    });

    console.log("Session set:", session);

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
