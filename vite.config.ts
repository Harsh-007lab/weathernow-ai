import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // IPv4-compatible
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production" && process.env.VERCEL_ENV === "production",
        drop_debugger: mode === "production" && process.env.VERCEL_ENV === "production",
      },
      mangle: { safari10: true },
      format: { comments: false },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
    sourcemap: mode === "development", // enabled only for local
  },
  // Don't override env handling
  define: {
    "process.env": process.env,
  },
}));
