import { FreshContext } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { kvRetrieveId } from "lib/kvCache.ts";
import { retrieveMsg } from "lib/messages.ts";
import { bail, prepareResponse, setLocation } from "lib/utils.ts";
import { ServerState } from "../types.ts";

export const handler = [
  async function authMiddleware(req: Request, ctx: FreshContext<ServerState>) {
    // We don't care about internal and static routes.
    if (ctx.destination != "route") return ctx.next();

    const isProtectedRoute = req.url.includes("secret") ||
      req.url.includes("welcome") ||
      req.url.includes("update-password");

    const { headers, logger, url } = prepareResponse(req, "authMiddleware");

    const supabase = createSupabaseClient(req, headers);

    // From the docs at https://supabase.com/docs/guides/auth/server-side/nextjs:
    // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
    // Always use supabase.auth.getUser() to protect pages and user data. Never trust supabase.auth.getSession()
    // inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.
    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    logger.debug(`"${url.pathname}" called for user.email=${user?.email}`);

    // 400 AuthSessionMissingError, e.g. no session data in cookies, we just want to redirect below.
    if (error && error.status !== 400) {
      return bail(headers, logger, error, true);
    }

    if (isProtectedRoute && !user) {
      // Classic case of 403 but instead of just throwing that and leaving the UI busted, we want to redirect to the home page.
      setLocation(headers, url, "/sign-in");
      logger.debug(`403 caught. Redirecting to ${headers.get("location")}`);
      return new Response(null, { status: 303, headers });
    }

    ctx.state.user = user;

    logger.debug(
      `Calling next for user.email=${user?.email}, location=${
        headers.get(
          "location",
        )
      }`,
    );
    return ctx.next();
  },
  // Looks for message id search params, retrieves the message and passes it as `ctx.state.message`.
  async function serverMessageMiddleware(
    req: Request,
    ctx: FreshContext<ServerState>,
  ) {
    if (ctx.destination != "route") return ctx.next();

    const { logger, url } = prepareResponse(req, "serverMessageMiddleware");

    const mid = kvRetrieveId(url);
    if (mid) {
      logger.debug(`Retrieving message with id=${mid}`);
      const message = await retrieveMsg(url);
      ctx.state.message = message;
    }

    return ctx.next();
  },
];
