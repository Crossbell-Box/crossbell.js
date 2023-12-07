import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		testTimeout: 10 * 60 * 1000,
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		watch: false,
	},
})
