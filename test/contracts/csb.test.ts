import { describe, expect, test } from 'vitest'
import { mockUser, testContract } from '../mock'

describe('csb', () => {
	test('getBalance', async () => {
		const { data: balance } = await testContract.csb.getBalance({
			owner: mockUser.address,
		})
		expect(balance > 0n).toBe(true)
	})

	test('transfer', async () => {
		const res = await testContract.csb.transfer({
			toAddress: mockUser.address,
			amount: 0,
		})
		expect(res.transactionHash).toBeDefined()
	})
})
