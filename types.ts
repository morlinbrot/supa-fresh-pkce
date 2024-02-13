import { User } from "supabase";

import { ServerMessage } from "lib/messages.ts";
import { ServerData } from "lib/serverData.ts";

// Type of the `state` field of `FreshContext`.
// Will be passed to pages as part of the `PageProps<ServerState>`, accessible as `props.state`.
export type ServerState = {
  // The `User` object returned by Supabase.
  user: User | null;
  // Messages (and errors) to be displayed to the user.
  message: ServerMessage | null;
  // A way to pass data between different page renders.
  data: ServerData | null;
};
