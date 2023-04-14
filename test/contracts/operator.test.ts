import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../../src'
import { mockUser, NIL_ADDRESS } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('operator', () => {
  beforeAll(async () => {
    characterId = await contract.character
      .getPrimaryId(mockUser.address)
      .then((res) => res.data)

    expect(characterId).not.toBe(null)
  })

  describe('grant a permission and check', () => {
    test('grant permission', async () => {
      const res = await contract.operator.grantForCharacter(
        characterId!,
        NIL_ADDRESS,
        ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'],
      )

      expect(res.data.bitmapUint256.toString()).toBeDefined()
    })

    test('check permission', async () => {
      const res = await contract.operator.getPermissionsForCharacter(
        characterId!,
        NIL_ADDRESS,
      )

      expect(res.data.sort()).toEqual(
        ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'].sort(),
      )
    })
  })
})
