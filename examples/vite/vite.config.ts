import path from "node:path";
import Vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		resolve: {
			alias: {
				crossbell: path.resolve(__dirname, "../../src/index.ts"),
			},
		},
		define: {
			"globalThis.process.env.CROSSBELL_RPC_ADDRESS": JSON.stringify(
				env.CROSSBELL_RPC_ADDRESS,
			),
		},
		plugins: [Vue(), UnoCSS()],
	};
});
