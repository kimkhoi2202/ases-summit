import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		allowedHosts: true,
		historyApiFallback: true, // Enable history API fallback for client-side routing
	},
	build: {
		outDir: "dist",
		// Generate a _redirects file for Netlify or similar hosting services
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
});
