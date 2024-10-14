import { setCookie } from "$std/http/cookie.ts";
import { assert } from "$std/assert/assert.ts";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export function createSupabaseClient(req: Request, resHeaders = new Headers()) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  assert(
    SUPABASE_URL && SUPABASE_ANON_KEY,
    "SUPABASE URL and SUPABASE_ANON_KEY environment variables must be set.",
  );

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { flowType: "pkce" },
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          setCookie(resHeaders, { name, value, ...options })
        );
      },
    },
  });
}
