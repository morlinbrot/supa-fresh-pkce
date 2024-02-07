import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "lib/supabase.ts";

export const handler: Handlers = {
  async GET(req) {
    const headers = new Headers();
    headers.set("location", "/");

    const supabase = createSupabaseClient(req, headers);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return new Response(null, { status: 500, headers });
    }

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
