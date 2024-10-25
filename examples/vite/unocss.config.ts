import transformerDirectives from "@unocss/transformer-directives";
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
} from "unocss";

export default defineConfig({
	presets: [presetUno(), presetAttributify(), presetIcons()],
	transformers: [transformerDirectives()],
});
