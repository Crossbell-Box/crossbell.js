import { beforeAll, describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('tips with fee', () => {
  beforeAll(async () => {
    characterId = await contract.character
      .getPrimaryId({ address: mockUser.address })
      .then((res) => res.data)

    expect(characterId).not.toBe(null)
  })

  describe('tip', () => {
    test('tip character', async () => {
      const res = await contract.tipsWithFee.tipCharacter({
        fromCharacterId: characterId!,
        toCharacterId: characterId!,
        amount: 0,
        feeReceiver: mockUser.address,
      })

      expect(res.transactionHash).toBeDefined()
    })

    test('tip character for a note', async () => {
      const res = await contract.tipsWithFee.tipCharacterForNote({
        fromCharacterId: characterId!,
        toCharacterId: characterId!,
        toNoteId: 1n,
        amount: 0,
        feeReceiver: mockUser.address,
      })

      expect(res.transactionHash).toBeDefined()
    })

    test('tip failed when amount not enough', () => {
      expect(
        contract.tipsWithFee.tipCharacterForNote({
          fromCharacterId: characterId!,
          toCharacterId: characterId!,
          toNoteId: 1n,
          amount: 1000000000000n,
          feeReceiver: mockUser.address,
        }),
      ).rejects.toThrow()
    })
  })
})
