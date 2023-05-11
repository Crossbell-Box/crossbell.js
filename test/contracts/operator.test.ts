import { beforeAll, describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import { NIL_ADDRESS, mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('operator', () => {
  beforeAll(async () => {
    characterId = await contract.character
      .getPrimaryId({ address: mockUser.address })
      .then((res) => res.data)

    expect(characterId).not.toBe(null)
  })

  describe('grant a permission and check', () => {
    test('grant permission', async () => {
      const res = await contract.operator.grantForCharacter({
        characterId: characterId!,
        operator: NIL_ADDRESS,
        permissions: ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'],
      })

      expect(res.data.bitmapUint256.toString()).toBeDefined()
    })

    test('check permission', async () => {
      const res = await contract.operator.getPermissionsForCharacter({
        characterId: characterId!,
        operator: NIL_ADDRESS,
      })

      expect(res.data.sort()).toEqual(
        ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'].sort(),
      )
    })
  })
})
