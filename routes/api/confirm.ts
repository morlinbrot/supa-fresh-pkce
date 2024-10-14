import { Handlers } from "$fresh/server.ts";
import { type EmailOtpType } from "@supabase/supabase-js";

import { storeMessage } from "lib/messages.ts";
import { createSupabaseClient } from "lib/supabase.ts";
import { bail, prepareResponse, setLocation } from "lib/utils.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    const { headers, logger, url } = prepareResponse(req, "confirm");

    const { searchParams } = url;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    logger.debug(`Called with type=${type}, token_hash=${token_hash}`);

    if (token_hash && type) {
      const supabase = createSupabaseClient(req, headers);
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (error) return bail(headers, logger, error);

      url.searchParams.delete("token_hash");

      switch (type) {
        case "signup": {
          logger.debug(`Case type=${type}`);
          setLocation(headers, url, "sign-in");
          await storeMessage(
            headers,
            "Thanks for confirming your email address.",
            "You can now sign in.",
          );

          break;
        }
        case "recovery": {
          logger.debug(`Case type=${type}`);
          setLocation(headers, url, "update-password");
          break;
        }
      }
    }

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, { status: 303, headers });
  },
};
