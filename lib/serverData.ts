import { KvId, kvRetrieve, kvStore } from "lib/kvCache.ts";

export enum ServerDataType {
  EmailAddress,
}

export type ServerData = {
  type: ServerDataType;
  value: string;
};

export async function storeServerData(
  headers: Headers,
  value: ServerData,
): Promise<KvId> {
  return await kvStore<ServerData>(headers, "data", value);
}

export async function retrieveServerData(
  url: URL | string,
): Promise<ServerData | null> {
  return await kvRetrieve(url, "data");
}
