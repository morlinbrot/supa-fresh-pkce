import { FreshContext } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

export const handler = [
  async function authMiddleware(req: Request, ctx: FreshContext) {
    // We don't care about internal and static routes.
    if (ctx.destination != "route") return ctx.next();

    const url = new URL(req.url);
    const headers = new Headers();
    headers.set("location", "/");

    const supabase = createSupabaseClient(req, headers);
    // NOTE: Always use `getUser` instead of `getSession` as this calls the Supabase API and revalidates the token!
    const { error, data: { user } } = await supabase.auth.getUser();

    const isProtectedRoute = url.pathname.includes("secret") ||
      url.pathname.includes("welcome");

    // Don't mind 401 as it just means no credentials were provided, e.g. there was no session cookie.
    if (error && error.status !== 401) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      console.error(error);
      return new Response(null, { status: 500 });
    }

    // A user object is only mandatory if a protected route has been requested.
    if (isProtectedRoute && !user) {
      // Classic case of 403 but we want to redirect to the home page.
      return new Response(null, { status: 303, headers });
    }

    // Pass the user information to the frontend.
    ctx.state.user = user;

    return ctx.next();
  },
];
