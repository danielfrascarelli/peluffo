import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keeps the backend same-origin in development, so its SameSite=Strict cookies flow. `vite preview` reuses it.
  server: { proxy: { "/api/v1": "http://localhost:3000" } },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
