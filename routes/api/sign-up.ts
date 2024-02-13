import { FreshContext, Handlers } from "$fresh/server.ts";

import { storeMessage } from "lib/messages.ts";
import { createSupabaseClient } from "lib/supabase.ts";
import { bail, prepareResponse } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx: FreshContext) {
    const { headers, logger } = prepareResponse(req, "sign-up", "sign-in");

    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    if (!email || !password) {
      const error = new Error("Failed to parse email or password form fields.");
      return bail(headers, logger, error);
    }

    logger.debug(`Called with email=${email}`);

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) return bail(headers, logger, error, true);

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
