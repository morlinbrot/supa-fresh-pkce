import { Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { getLogger } from "../../utils.ts";

export const handler: Handlers = {
  async POST(req) {
    const logger = getLogger("sign-in");
    const form = await req.formData();
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const headers = new Headers();
    headers.set("location", "/");

    logger.debug(`Called with email=${email}`);

    const supabase = createSupabaseClient(req, headers);

    const { error } = await supabase.auth
      .signInWithPassword({
        email,
        password,
      });

    if (error) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      logger.error(error);
      return new Response(null, { status: 500 });
    }

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
