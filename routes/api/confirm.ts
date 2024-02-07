import { Handlers } from "$fresh/server.ts";
import { type EmailOtpType } from "supabase";

import { createSupabaseClient } from "lib/supabase.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    const url = new URL(req.url);

    const { searchParams } = url;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    // TODO: Handle all cases described here: https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr
    const next = searchParams.get("next") ?? "/";

    const redirectTo = new URL(url);
    redirectTo.pathname = next;

    if (token_hash && type) {
      const supabase = createSupabaseClient(req);

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (error) {
        // TODO: Return the user to an error page with some instructions.
        return Response.redirect(redirectTo);
      }
    }

    redirectTo.searchParams.delete("next");
    return Response.redirect(redirectTo);
  },
};
