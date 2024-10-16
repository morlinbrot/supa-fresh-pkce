// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_confirm from "./routes/api/confirm.ts";
import * as $api_recover from "./routes/api/recover.ts";
import * as $api_sign_in from "./routes/api/sign-in.ts";
import * as $api_sign_out from "./routes/api/sign-out.ts";
import * as $api_sign_up from "./routes/api/sign-up.ts";
import * as $api_update_password from "./routes/api/update-password.ts";
import * as $index from "./routes/index.tsx";
import * as $recover from "./routes/recover.tsx";
import * as $secret from "./routes/secret.tsx";
import * as $sign_in from "./routes/sign-in.tsx";
import * as $sign_up from "./routes/sign-up.tsx";
import * as $update_password from "./routes/update-password.tsx";
import * as $welcome from "./routes/welcome.tsx";
import * as $AuthForm from "./islands/AuthForm.tsx";
import * as $RecoverForm from "./islands/RecoverForm.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/confirm.ts": $api_confirm,
    "./routes/api/recover.ts": $api_recover,
    "./routes/api/sign-in.ts": $api_sign_in,
    "./routes/api/sign-out.ts": $api_sign_out,
    "./routes/api/sign-up.ts": $api_sign_up,
    "./routes/api/update-password.ts": $api_update_password,
    "./routes/index.tsx": $index,
    "./routes/recover.tsx": $recover,
    "./routes/secret.tsx": $secret,
    "./routes/sign-in.tsx": $sign_in,
    "./routes/sign-up.tsx": $sign_up,
    "./routes/update-password.tsx": $update_password,
    "./routes/welcome.tsx": $welcome,
  },
  islands: {
    "./islands/AuthForm.tsx": $AuthForm,
    "./islands/RecoverForm.tsx": $RecoverForm,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
