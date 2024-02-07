import { FreshContext, Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx: FreshContext) {
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");

    const headers = new Headers();
    headers.set("location", "/sign-in");

    const supabase = createSupabaseClient(req, headers);

    const { error } = await supabase.auth.signUp({
      email: String(email),
      password: String(password),
    });

    if (error) {
      // TODO: Add some actual error handling.
      console.error(error);
      return new Response(null, { status: 500 });
    }

    // For now, we simply redirect to the home page.
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
