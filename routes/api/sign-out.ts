import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { getLogger } from "lib/logger.ts";
import { storeError } from "lib/messages.ts";

export const handler: Handlers = {
  async GET(req) {
    const logger = getLogger("sign-out");
    const headers = new Headers();
    headers.set("location", "/");

    logger.debug(`Called`);

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error(error);
      await storeError(headers, error);
      return new Response(null, { status: 500, headers });
    }

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
