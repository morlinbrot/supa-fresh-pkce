import { PageProps } from "$fresh/server.ts";

import { Layout } from "components/index.ts";
import { ServerState } from "../types.ts";

export default function Secret(props: PageProps<null, ServerState>) {
  return (
    <Layout state={props.state}>
      <div class="flex flex-col items-center">
        <h2>Congrats, You've reached the secret page!</h2>
        <p>Here's a tasty treat:</p>
        <p class="text-[72px] text-align-center">🍋</p>
      </div>
    </Layout>
  );
}
