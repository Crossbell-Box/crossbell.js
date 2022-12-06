import { type BigNumberish } from 'ethers'
import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../../src'
import { mockUser, NIL_ADDRESS } from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: BigNumberish | null = null

describe('permission', () => {
  beforeAll(async () => {
    await contract.connect()

    characterId = await contract
      .getPrimaryCharacterId(mockUser.address)
      .then((res) => res.data)

    expect(characterId).not.toBe(null)
  })

  describe('grant a permission and check', () => {
    test('grant permission', async () => {
      const res = await contract.grantOperatorPermissionsForCharacter(
        characterId!,
        NIL_ADDRESS,
        ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'],
      )

      expect(res.data.bitmapUint256.toString()).toBeDefined()
    })

    test('check permission', async () => {
      const res = await contract.getOperatorPermissionsForCharacter(
        characterId!,
        NIL_ADDRESS,
      )

      expect(res.data.sort()).toEqual(
        ['POST_NOTE', 'SET_NOTE_URI', 'LINK_CHARACTER'].sort(),
      )
    })
  })
})
