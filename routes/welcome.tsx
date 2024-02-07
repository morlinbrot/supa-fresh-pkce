import { PageProps } from "$fresh/server.ts";

import { Layout, Link } from "components/index.ts";
import { ServerState } from "../types.ts";

export default function Welcome(props: PageProps<ServerState>) {
  const state = props.state as ServerState;

  return (
    <Layout state={state}>
      <img
        src="/logo.svg"
        class="w-32 h-32"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />

      <h2>Welcome</h2>

      <p>
        Thanks for confirming your e-mail address. Go ahead and have a look at
        the <Link href="/secret">secret</Link> page.
      </p>
    </Layout>
  );
}
