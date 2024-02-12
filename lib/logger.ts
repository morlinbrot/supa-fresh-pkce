import { AuthError } from "supabase";

export const getLogger = (component: string) => {
  return {
    debug: (msg: string) => {
      console.debug(`[SFP App::${component}]: ${msg}`);
    },
    error: (error: AuthError | Error) => {
      console.error(`[SFP App::${component}]: ${error.name}: ${error.message}`);
    },
  };
};
