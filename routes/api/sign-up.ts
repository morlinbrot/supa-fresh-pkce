import { FreshContext, Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { getLogger } from "lib/logger.ts";
import { storeError, storeMessage } from "lib/messages.ts";

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
      await storeError(headers, error);
      return new Response(null, { status: 500 });
    }

    await storeMessage(
      headers,
      "Thanks for signing up.",
      "Please confirm your email address to sign in.",
    );

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
