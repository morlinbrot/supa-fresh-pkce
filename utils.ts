import { AuthError } from "supabase";

export const getLogger = (component: string) => {
  return {
    debug: (msg: string) => {
      console.debug(`[SFP App::${component}]: ${msg}`);
    },
    error: (error: AuthError) => {
      console.error(`[SFP App::${component}]: ${error.name}: ${error.message}`);
    },
  };
};
