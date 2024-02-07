import tailwind from "$fresh/plugins/tailwind.ts";
import { defineConfig } from "$fresh/server.ts";

export default defineConfig({
  plugins: [tailwind()],
  port: 8080,
});
