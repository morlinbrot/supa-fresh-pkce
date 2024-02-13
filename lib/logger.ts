import { AuthError } from "supabase";

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
      console.error(`[SFP App::${component}]: ${error.name}: ${error.message}`);
    },
  };
};
