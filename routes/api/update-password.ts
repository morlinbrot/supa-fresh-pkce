import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { storeMessage } from "lib/messages.ts";
import { bail, prepareResponse, setLocation } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req: Request) {
    const { headers, logger, url } = prepareResponse(req, "update-password");

    const form = await req.formData();
    const password = form.get("password")?.toString();

    logger.debug("Called.");

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.status === 422 && error.message.includes("be different")) {
        setLocation(headers, url, "update-password");
        return bail(headers, logger, error);
      }

      return bail(headers, logger, error, true);
    }

    await storeMessage(headers, "Password updated.", "");

    logger.debug(
      `Success. Redirecting to location=${headers.get("location")}"`,
    );
    return new Response(null, { status: 303, headers });
  },
};
