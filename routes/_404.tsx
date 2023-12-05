import { Head } from "$fresh/runtime.ts";

import { Layout } from "components/index.ts";
import { ServerState } from "../types.ts";

export default function Error404() {
  const state = {} as ServerState;
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>

      <Layout state={state}>
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <p class="my-4">
            The page you were looking for doesn't exist.
          </p>
        </div>
      </Layout>
    </>
  );
}
