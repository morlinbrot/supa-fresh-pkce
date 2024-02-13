/**
 * The module serves as a messaging system between `/api` endpoints ("back-end") and non-API route
 * handlers ("front-end") in order to pass errors and other information from the back-end to the user.
 * In the context of sever-side rendering, there is no elegant way of passing information through a
 * redirect which is why we're using `Deno.Kv` to store (possibly sensitive) data, generate an id and
 * pass only that as a search param. A middleware can intercept the ids, retrieve the data and attach it
 * to `FreshContext.state` to pass it to the page that is about to be rendered.
 */

export type KvId = string;

// Name of the search parameter that will be used to store generated ids.
export const KV_KEY = "kvid";

// Generate an id with very basic uniqueness algorithm.
export function kvGenId(): KvId {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Extract a `KvId` from `url` search parameters.
 */
export function kvRetrieveId(url: URL | string): KvId | null {
  const u = typeof url === "string" ? new URL(url) : url;
  const id = u.searchParams.get(KV_KEY);
  return id || null;
}

/**
 * Store `value` in `Deno.Kv` under a generated id and set the id as `KV_KEY` search parameter in `headers`.
 */
export async function kvStore<T>(
  headers: Headers,
  prefix: string,
  value: T,
  options: object = {},
): Promise<string> {
  const id = kvGenId();
  const kv = await Deno.openKv();
  await kv.set([prefix, id], value, options);

  const location = `${headers.get("location") || "/"}?${KV_KEY}=${id}`;
  headers.set("location", location);

  return id;
}

/**
 * Extract a `KV_KEY` from the search params of `url` and retrieve its value from `Deno.Kv`.
 */
export async function kvRetrieve<T>(
  url: URL | string,
  prefix: string,
): Promise<T | null> {
  const id = kvRetrieveId(url);
  if (!id) return null;

  const key = [prefix, id];
  const kv = await Deno.openKv();
  const res = await kv.get<T>(key);
  await kv.delete(key);

  return res.value;
}
