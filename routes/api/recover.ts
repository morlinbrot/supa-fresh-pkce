import { Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { getLogger } from "lib/logger.ts";
import { bail, setLocation } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req: Request) {
    const logger = getLogger("recover");

    const url = new URL(req.url);
    const headers = new Headers();
    setLocation(headers, url, "/");

    const form = await req.formData();
    const email = form.get("email")?.toString();
    if (!email) {
      const error = new Error("Failed to parse email form field.");
      return bail(headers, logger, error);
    }

    logger.debug(`Called for email=${email}`);

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) bail(headers, logger, error, true);

    logger.debug(`Success. Redirecting to location=${headers.get("location")}`);
    return new Response(null, { status: 303, headers });
  },
};
