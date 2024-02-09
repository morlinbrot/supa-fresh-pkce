import { User } from "supabase";

import { ServerMessage } from "lib/messages.ts";

// Type of the `state` field of `FreshContext`.
// Will be passed to pages as part of the `PageProps<ServerState>`, accessible as `props.state`.
export type ServerState = {
  // The `User` object returned by Supabase.
  user: User | null;
  error: { code: number; msg: string } | null;
  message: ServerMessage | null;
};
