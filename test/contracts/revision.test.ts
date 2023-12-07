import { describe, expect, it } from 'vitest'
import { testContract } from '../mock'

describe('revision', () => {
	it.concurrent('should return the latest revision', async () => {
		const { data: latest } = await testContract.revision.getLatest()
		expect(latest > 0n).toBe(true)

		const { data: current } = testContract.revision.getCurrent()
		expect(current).toBe(latest)
	})

	it.concurrent('check', async () => {
		const res = await testContract.revision.check()
		expect(res.data.currentRevision > 0n).toBe(true)
		expect(res.data.isUpToDate).is.a('boolean')
		expect(res.data.latestRevision > 0n).toBe(true)
	})
})
