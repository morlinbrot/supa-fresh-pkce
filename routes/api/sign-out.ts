import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { bail, prepareResponse } from "lib/utils.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    const { headers, logger } = prepareResponse(req, "sign-out");

    logger.debug(`Called`);

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.signOut();

    if (error) return bail(headers, logger, error, true);

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
