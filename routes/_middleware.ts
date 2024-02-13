import { FreshContext } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { kvRetrieveId } from "lib/kvCache.ts";
import { retrieveMsg } from "lib/messages.ts";
import { bail, prepareResponse } from "lib/utils.ts";
import { ServerState } from "../types.ts";

export const handler = [
  async function authMiddleware(
    req: Request,
    ctx: FreshContext<ServerState>,
  ) {
    // We don't care about internal and static routes.
    if (ctx.destination != "route") return ctx.next();

    const { headers, logger, url } = prepareResponse(req, "authMiddleware");

    const isProtectedRoute = url.pathname.includes("secret") ||
      url.pathname.includes("welcome") ||
      url.pathname.includes("update-password");

    const supabase = createSupabaseClient(req, headers);
    // NOTE: Always use `getUser` instead of `getSession` as this calls the Supabase API and revalidates the token!
    const { error, data: { user } } = await supabase.auth.getUser();

    logger.debug(`"${url.pathname}" called for user.email=${user?.email}`);

    // Don't mind 401 as it just means no credentials were provided, e.g. there was no session cookie.
    if (error && error.status !== 401) {
      return bail(headers, logger, error, true);
    }

    if (isProtectedRoute && !user) {
      // Classic case of 403 but we want to redirect to the home page.
      logger.debug(`403 caught. Redirecting to ${headers.get("location")}`);
      return new Response(null, { status: 303, headers });
    }

    ctx.state.user = user;

    logger.debug(
      `Calling next for user.email=${user?.email}, location=${
        headers.get("location")
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
