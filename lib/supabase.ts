import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { assert } from "$std/assert/assert.ts";
import { type CookieOptions, createServerClient } from "supabase/ssr";

export function createSupabaseClient(
  req: Request,
  resHeaders = new Headers(),
) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  assert(
    SUPABASE_URL && SUPABASE_ANON_KEY,
    "SUPABASE URL and SUPABASE_ANON_KEY environment variables must be set.",
  );

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { flowType: "pkce" },
    cookies: {
      get(name: string) {
        const cookies = getCookies(req.headers);
        return decodeURIComponent(cookies[name]);
      },
      set(name: string, value: string, options: CookieOptions) {
        setCookie(resHeaders, {
          name,
          value: encodeURIComponent(value),
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        deleteCookie(resHeaders, name, options);
      },
    },
  });
}
