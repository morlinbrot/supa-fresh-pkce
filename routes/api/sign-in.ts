import { Handlers } from "$fresh/server.ts";
import { AuthRetryableFetchError } from "@supabase/supabase-js";

import { storeMessage } from "lib/messages.ts";
import { createSupabaseClient } from "lib/supabase.ts";
import { bail, prepareResponse } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req) {
    const { headers, logger } = prepareResponse(req, "sign-in");

    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    if (!email || !password) {
      const error = new Error("Failed to parse email or password form fields.");
      return bail(headers, logger, error);
    }

    logger.debug(`Called with email=${email}`);

    const supabase = createSupabaseClient(req, headers);

    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (
      error &&
      error.status === 400 &&
      error.message.includes("not confirmed")
    ) {
      logger.debug(
        `Email not confirmed. Redirecting to: ${headers.get("location")}`,
      );
      await storeMessage(
        headers,
        "Email not confirmed.",
        "Please confirm your email address before signing in.",
      );
      return new Response(null, { status: 303, headers });
    }

    if (error) {
      if (error instanceof AuthRetryableFetchError) {
        logger.debug(
          "AuthRetryableFetchError: Is the Supabase project currently paused?",
        );
      }

      return bail(headers, logger, error, true);
    }

    await storeMessage(headers, "Welcome back", `${user?.email}`);

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, { status: 303, headers });
  },
};
