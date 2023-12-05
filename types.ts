import { User } from "supabase";

export type ServerState = {
  user: User | null;
  error: { code: number; msg: string } | null;
};
