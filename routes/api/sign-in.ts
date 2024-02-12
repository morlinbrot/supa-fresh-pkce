import { Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { storeError, storeMessage } from "lib/messages.ts";
import { getLogger } from "lib/logger.ts";

export const handler: Handlers = {
  async POST(req) {
    const logger = getLogger("sign-in");

    const headers = new Headers();
    headers.set("location", "/");

    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    if (!email || !password) {
      const error = new Error("Failed to parse email or password form fields.");
      logger.error(error);
      await storeError(headers, error);
      return new Response(null, { status: 303, headers });
    }

    logger.debug(`Called with email=${email}`);

    const supabase = createSupabaseClient(req, headers);

    const { error, data: { user } } = await supabase.auth
      .signInWithPassword({
        email,
        password,
      });

    if (error) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      logger.error(error);
      await storeError(headers, error);
      return new Response(null, { status: 303, headers });
    }

    await storeMessage(headers, "Welcome back", `${user?.email}`);

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
