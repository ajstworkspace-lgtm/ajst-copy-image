import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [react()],
  base: "/ajst-copy-image", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  }, // مهم جداً
})

// // https://vitejs.dev/config/
// export default defineConfig(({  }) => ({
//   plugins: [react()],
//   base: "/ajst-copy-image/",  // <-- ADD THIS LINE (change to your repo name)
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//     dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
//   },
// }));