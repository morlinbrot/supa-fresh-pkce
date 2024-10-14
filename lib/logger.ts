import { AuthError } from "@supabase/supabase-js";

export interface Logger {
  debug: (msg: string) => void;
  error: (error: AuthError | Error) => void;
}

export const getLogger = (component: string): Logger => {
  return {
    debug: (msg: string) => {
      console.debug(`[SFP App::${component}]: ${msg}`);
    },
    error: (error: AuthError | Error) => {
      console.error(
        `[SFP App::${component}]: ${
          (error as AuthError).status || ""
        }${error.name}: ${error.message}`,
      );
    },
  };
};
