import { type AuthError } from "@supabase/supabase-js";
import { KvId, kvRetrieve, kvStore } from "lib/kvCache.ts";

export interface ServerMessage {
  title: string;
  text: string;
  code: number | null;
}

// Store a `ServerMessage` in Deno.Kv, and store its generated id as a search parameter in `headers`.
export async function storeMessage(
  headers: Headers,
  title: string,
  text: string,
  code?: number,
): Promise<KvId> {
  return await kvStore(
    headers,
    "messages",
    { title, text, code },
    {
      expireIn: 5000,
    },
  );
}

// Store an `Error` or Supabase `AuthError` as `ServerMessage` in `Deno.Kv`.
export function storeError(
  headers: Headers,
  error: AuthError | Error,
): Promise<KvId> {
  return storeMessage(
    headers,
    error.name,
    error.message,
    (error as AuthError).status ?? 500,
  );
}

// Extract an id from `url` and retrieve the message from `Deno.Kv`.
export async function retrieveMsg(
  url: URL | string,
): Promise<ServerMessage | null> {
  return await kvRetrieve(url, "messages");
}
