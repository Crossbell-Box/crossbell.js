import { beforeAll, describe, expect, test } from 'vitest'
import { NIL_ADDRESS, mockUser, testContract } from '../mock'

let characterId: bigint | null = null

describe('operator', () => {
	beforeAll(async () => {
		characterId = await testContract.character
			.getPrimaryId({ address: mockUser.address })
			.then((res) => res.data)

		expect(characterId).not.toBe(null)
	})

	describe('grant a permission and check', () => {
		test('grant permission', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await testContract.operator.grantForCharacter({
				characterId: characterId,
				operator: NIL_ADDRESS,
				permissions: ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'],
			})

			expect(res.data.bitmapUint256.toString()).toBeDefined()
		})

		test('check permission', async () => {
			if (!characterId) throw new Error('characterId is null')
			const res = await testContract.operator.getPermissionsForCharacter({
				characterId: characterId,
				operator: NIL_ADDRESS,
			})

			expect(res.data.sort()).toEqual(
				['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'].sort(),
			)
		})
	})
})
