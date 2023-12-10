import { Handlers, PageProps } from "$fresh/server.ts";

import { getCookies } from "$std/http/cookie.ts";
import { Layout, Link } from "components/index.ts";
import { ServerState } from "../types.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    ctx.state.user = cookies.auth === "makelemonade" ? {} : null;
    return ctx.render(ctx.state);
  },
};

export default function Home(props: PageProps<ServerState>) {
  const isAllowed = !!props.state.user;
  const state = props.state as ServerState;

  return (
    <Layout state={state}>
      <img
        src="/logo.svg"
        class="w-32 h-32"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />

      <h2>Supa Fresh PKCE</h2>

      <p>
        An example app built with Deno's{" "}
        <Link href="https://fresh.deno.dev/" target="_blank">
          Fresh
        </Link>{"  "}
        framework, using{" "}
        <Link href="https://supabase.com/" target="_blank">
          Supabase
        </Link>{" "}
        to implement the{" "}
        <Link href="https://oauth.net/2/pkce/" target="_blank">
          PKCE authentication scheme.
        </Link>
        {" "}
      </p>

      <div class="my-4">
        <a
          href="https://fresh.deno.dev"
          target="_blank"
          style={{ display: "block", width: "fit-content" }}
        >
          <img
            width="197"
            height="37"
            src="https://fresh.deno.dev/fresh-badge.svg"
            alt="Made with Fresh"
          />
        </a>
      </div>

      {!isAllowed
        ? <Link href="/sign-in">Sign In</Link>
        : <Link href="/api/sign-out">Sign Out</Link>}
    </Layout>
  );
}
