import { AuthError } from "supabase";

import { storeError } from "lib/messages.ts";
import { Logger } from "lib/logger.ts";

export async function bail(
  headers: Headers,
  logger: Logger,
  error: Error | AuthError,
  silent = false,
) {
  logger.error(error);
  if (!silent) await storeError(headers, error);
  return new Response(null, { status: 303, headers });
}

/** Construct an absolute URL from `url` and `path`, replacing `url`'s full `pathname`, then set it as location header.
 * In accordance with RFC2616: https://datatracker.ietf.org/doc/html/rfc2616#section-14.30
 */
export function setLocation(headers: Headers, url: URL, path: string) {
  const stripped = path.startsWith("/") ? path.slice(1) : path;
  headers.set("location", `${url.origin}/${stripped}`);
}
