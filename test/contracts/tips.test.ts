import { type BigNumberish } from 'ethers'
import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: BigNumberish | null = null

describe('tips', () => {
  beforeAll(async () => {
    characterId = await contract
      .getPrimaryCharacterId(mockUser.address)
      .then((res) => res.data)

    expect(characterId).not.toBe(null)
  })

  describe('tip', () => {
    test('tip character', async () => {
      const res = await contract.tipCharacter(characterId!, characterId!, 0)

      expect(res.transactionHash).toBeDefined()
    })

    test('tip character for a note', async () => {
      const res = await contract.tipCharacterForNote(
        characterId!,
        characterId!,
        1,
        0,
      )

      expect(res.transactionHash).toBeDefined()
    })

    test('tip failed when amount not enough', async () => {
      expect(
        contract.tipCharacterForNote(
          characterId!,
          characterId!,
          1,
          1000000000000,
        ),
      ).rejects.toThrow()
    })
  })
})
