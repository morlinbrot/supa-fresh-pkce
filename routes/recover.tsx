import { PageProps } from "$fresh/server.ts";

import { Layout } from "components/index.ts";
import RecoverForm, { RecoverMode } from "islands/RecoverForm.tsx";
import { ServerState } from "../types.ts";

export default function RecoveryPage(props: PageProps<null, ServerState>) {
  return (
    <Layout state={props.state}>
      <div class="flex justify-center">
        <div class="flex flex-col items-stretch w-[500px] md:w-2/3">
          <div class="flex justify-center">
            <img
              src="/logo.svg"
              class="w-16 h-16 mt-8 mb-4"
              alt="the fresh logo: a sliced lemon dripping with juice"
            />
          </div>

          <RecoverForm mode={RecoverMode.Reset} />
        </div>
      </div>
    </Layout>
  );
}
