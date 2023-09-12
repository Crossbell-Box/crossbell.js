import { beforeAll, describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('tips', () => {
	beforeAll(async () => {
		characterId = await contract.character
			.getPrimaryId({ address: mockUser.address })
			.then((res) => res.data)

		expect(characterId).not.toBe(null)
	})

	describe('tip', () => {
		test('tip character', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await contract.tips.tipCharacter({
				fromCharacterId: characterId,
				toCharacterId: characterId,
				amount: 0,
			})

			expect(res.transactionHash).toBeDefined()
		})

		test('tip character for a note', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await contract.tips.tipCharacterForNote({
				fromCharacterId: characterId,
				toCharacterId: characterId,
				toNoteId: 1n,
				amount: 0,
			})

			expect(res.transactionHash).toBeDefined()
		})

		test('tip failed when amount not enough', () => {
			if (!characterId) throw new Error('characterId is null')
			expect(
				contract.tips.tipCharacterForNote({
					fromCharacterId: characterId,
					toCharacterId: characterId,
					toNoteId: 1n,
					amount: 1000000000000n,
				}),
			).rejects.toThrow()
		})
	})
})
