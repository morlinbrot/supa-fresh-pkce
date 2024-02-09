import { type AuthError } from "supabase";

export interface ServerMessage {
  title: string;
  text: string;
  code: number | null;
}

export const MESSAGE_KEY = "mid";

// Generate an id with very basic uniqueness algorithm.
export function genMsgId() {
  return `msgId-${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// Store a `ServerMessage` in Deno.Kv, and store its id as a cookie.
export async function storeMessage(
  headers: Headers,
  title: string,
  text: string,
  code?: number,
): Promise<string> {
  const mid = genMsgId();
  const kv = await Deno.openKv();
  await kv.set(["messages", mid], { title, text, code });

  const location = `${headers.get("location") || "/"}?${MESSAGE_KEY}=${mid}`;
  headers.set("location", location);

  return mid;
}

// Store a Supabase `AuthError` as `ServerMessage` in `Deno.Kv`.
export function storeError(
  headers: Headers,
  error: AuthError,
): Promise<string> {
  return storeMessage(
    headers,
    error.name,
    error.message,
    error.status,
  );
}

// Retrieve a message from `Deno.Kv`.
export async function kvGetMsg(id: string): Promise<ServerMessage | null> {
  const kv = await Deno.openKv();
  const res = await kv.get<ServerMessage>(["messages", id]);
  return res.value;
}

// Extract message id from search params adn retrieve message from `Deno.Kv`.
export async function retrieveMsg(
  url: URL | string,
): Promise<ServerMessage | null> {
  const u = typeof url === "string" ? new URL(url) : url;
  const id = u.searchParams.get(MESSAGE_KEY);
  if (!id) return null;
  return await kvGetMsg(id);
}
