import { beforeAll, describe, expect, test } from 'vitest'
import { mockUser, testContract } from '../mock'

let characterId: bigint | null = null

describe('tips with fee', () => {
	beforeAll(async () => {
		characterId = await testContract.character
			.getPrimaryId({ address: mockUser.address })
			.then((res) => res.data)

		expect(characterId).not.toBe(null)
	})

	describe('tip', () => {
		test('tip character', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await testContract.tipsWithFee.tipCharacter({
				fromCharacterId: characterId,
				toCharacterId: characterId,
				amount: 0,
				feeReceiver: mockUser.address,
			})

			expect(res.transactionHash).toBeDefined()
		})

		test('tip character for a note', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await testContract.tipsWithFee.tipCharacterForNote({
				fromCharacterId: characterId,
				toCharacterId: characterId,
				toNoteId: 1n,
				amount: 0,
				feeReceiver: mockUser.address,
			})

			expect(res.transactionHash).toBeDefined()
		})

		test('tip failed when amount not enough', () => {
			if (!characterId) throw new Error('characterId is null')
			expect(
				testContract.tipsWithFee.tipCharacterForNote({
					fromCharacterId: characterId,
					toCharacterId: characterId,
					toNoteId: 1n,
					amount: 1000000000000n,
					feeReceiver: mockUser.address,
				}),
			).rejects.toThrow()
		})
	})
})
