import { type Options, defineConfig } from "tsup";

const commonConfig: Options = {
	entry: [
		"./src/index.ts",
		"./src/contract/index.ts",
		"./src/indexer/index.ts",
		"./src/ipfs/index.ts",
		"./src/network/index.ts",
		"./src/utils/index.ts",
	],
	outDir: "dist",
	clean: true,
	sourcemap: true,
	treeshake: true,
};

export default defineConfig((options) => [
	{
		...commonConfig,
		format: ["cjs", "esm"],
		platform: "node",
		dts: options.dts,
		target: "node16.14",
	},
	{
		...commonConfig,
		format: ["iife"],
		globalName: "Crossbell",
		minify: !options.watch,
		platform: "browser",
		dts: false,
		target: "es2020",
	},
]);
