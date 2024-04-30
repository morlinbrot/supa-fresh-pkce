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

    const isProtectedRoute = req.url.includes("secret") ||
      req.url.includes("welcome") ||
      req.url.includes("update-password");

    const { headers, logger, url } = prepareResponse(req, "authMiddleware");

    const supabase = createSupabaseClient(req, headers);
    // const hasAuthHeader = headers.forEach((val, key) => {
    //   console.log("HEADER: ", key, val);
    // });

    // NOTE: Always use `getUser` instead of `getSession` as this calls the Supabase API and revalidates the token!
    const { error, data: { user } } = await supabase.auth.getUser();

    logger.debug(`"${url.pathname}" called for user.email=${user?.email}`);

    // Don't mind 401 as it just means no credentials were provided, e.g. there was no session cookie.
    // FIXME: Handle 403 differently.
    // Currently: If no header is set on the request, `createSupabaseClient` still creates an empty one that leads to a 403. Fix is probably to refactor the  middleware so it only creates the client if a header is set.
    if (error && error.status !== 401 && error.status !== 403) {
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
