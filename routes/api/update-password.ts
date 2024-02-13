import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

import { getLogger } from "lib/logger.ts";
import { storeError, storeMessage } from "lib/messages.ts";
import { setLocation } from "lib/utils.ts";

export const handler: Handlers = {
  async POST(req: Request) {
    const logger = getLogger("sign-in");

    const url = new URL(req.url);

    const headers = new Headers();
    headers.set("location", "/");

    const form = await req.formData();
    const password = form.get("password")?.toString();

    const supabase = createSupabaseClient(req, headers);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      logger.error(error);
      if (
        error && error.status === 422 &&
        error.message.includes("should be different")
      ) {
        setLocation(headers, url, "update-password");
        await storeError(headers, error);
      } else {
        setLocation(headers, url, "/");
      }

      return new Response(null, { status: 303, headers });
    }

    setLocation(headers, url, "/");
    await storeMessage(headers, "Password updated.", "");

    logger.debug(
      `Success. Redirecting to location=${headers.get("location")}"`,
    );
    return new Response(null, { status: 303, headers });
  },
};
