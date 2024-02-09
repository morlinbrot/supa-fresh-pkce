import { Handlers } from "$fresh/server.ts";
import { type EmailOtpType } from "supabase";

import { getLogger } from "lib/logger.ts";
import { createSupabaseClient } from "lib/supabase.ts";
import { storeError, storeMessage } from "lib/messages.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    const logger = getLogger("confirm");
    const url = new URL(req.url);

    const { searchParams } = url;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    // TODO: Handle all cases described here: https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr
    const next = searchParams.get("next") ?? "/sign-in";

    logger.debug(`Called with type=${type}, token_hash=${token_hash}`);

    const headers = new Headers();
    headers.set("location", next);

    if (token_hash && type) {
      const supabase = createSupabaseClient(req);

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (error) {
        logger.error(error);
        await storeError(headers, error);
        return new Response(null, { status: 303, headers });
      }
    }

    await storeMessage(
      headers,
      "Thanks for confirming your email address.",
      "You can now sign in.",
    );

    logger.debug(`Success. Redirecting to: ${headers.get("location")}`);
    return new Response(null, { status: 303, headers });
  },
};
