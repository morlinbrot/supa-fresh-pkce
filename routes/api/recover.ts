import { Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";
import { bail, prepareResponse } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req: Request) {
    const { headers, logger } = prepareResponse(req, "recover");

    const form = await req.formData();
    const email = form.get("email")?.toString();
    if (!email) {
      const error = new Error("Failed to parse email form field.");
      return bail(headers, logger, error);
    }

    logger.debug(`Called for email=${email}`);

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return bail(headers, logger, error, true);

    logger.debug(`Success. Redirecting to location=${headers.get("location")}`);
    return new Response(null, { status: 303, headers });
  },
};
