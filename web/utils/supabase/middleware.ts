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

  const tokens = request.nextUrl
    .clone()
    .pathname.split("/")
    .filter((val) => val);

  if (tokens && tokens[0] && tokens[1]) {
    await supabase.auth.setSession({
      refresh_token: tokens[1],
      access_token: tokens[0],
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
