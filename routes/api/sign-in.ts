import { Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "lib/supabase.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const headers = new Headers();
    headers.set("location", "/");

    const supabase = createSupabaseClient(req, headers);

    const { error } = await supabase.auth
      .signInWithPassword({
        email,
        password,
      });

    if (error) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      return new Response(null, { status: 500 });
    }

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
