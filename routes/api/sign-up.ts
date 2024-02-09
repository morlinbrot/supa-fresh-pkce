import { FreshContext, Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { getLogger } from "../../utils.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx: FreshContext) {
    const logger = getLogger("sign-up");
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");

    const headers = new Headers();
    headers.set("location", "/sign-in");

    logger.debug(`Called with email=${email}`);

    const supabase = createSupabaseClient(req, headers);

    const { error } = await supabase.auth.signUp({
      email: String(email),
      password: String(password),
    });

    if (error) {
      // TODO: Add some actual error handling.
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
