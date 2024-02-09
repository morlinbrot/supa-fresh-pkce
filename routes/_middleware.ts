import { FreshContext } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { getLogger } from "../utils.ts";

export const handler = [
  async function authMiddleware(req: Request, ctx: FreshContext) {
    const logger = getLogger("authMiddleware");
    // We don't care about internal and static routes.
    if (ctx.destination != "route") return ctx.next();

    const url = new URL(req.url);
    const headers = new Headers();
    headers.set("location", "/");

    const isProtectedRoute = url.pathname.includes("secret") ||
      url.pathname.includes("welcome");

    const supabase = createSupabaseClient(req, headers);
    // NOTE: Always use `getUser` instead of `getSession` as this calls the Supabase API and revalidates the token!
    const { error, data: { user } } = await supabase.auth.getUser();

    logger.debug(`"${url.pathname}" called for user.email=${user?.email}`);

    // Don't mind 401 as it just means no credentials were provided, e.g. there was no session cookie.
    if (error && error.status !== 401) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      logger.error(error);
      return new Response(null, { status: 500 });
    }

    // A user object is only mandatory if a protected route has been requested.
    if (isProtectedRoute && !user) {
      // Classic case of 403 but we want to redirect to the home page.
      logger.debug(`403 Redirecting to ${headers.get("location")}`);
      return new Response(null, { status: 303, headers });
    }

    // Pass the user information to the frontend.
    ctx.state.user = user;

    logger.debug(`Calling next for user.email=${user?.email}`);
    return ctx.next();
  },
];
