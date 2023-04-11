import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { expect, describe, test } from 'vitest'
import { Contract } from '../../src'
import {
  mockUser,
  randomHandle,
  randomHandle2,
  metadataUri,
  metadataUri2,
  genRandomHandle,
} from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('character', () => {
  describe('create a character and check', () => {
    test('should fail to createCharacter if the handle is not in correct format', () => {
      expect(
        contract.character.createCharacter(
          mockUser.address,
          'cannot contain whitespace',
          metadataUri,
        ),
      ).rejects.toThrow(/Invalid handle/)

      expect(
        contract.character.createCharacter(
          mockUser.address,
          'cannot-contain-be-more-than-32-characters-longlonglonglonglonglonglonglonglong',
          metadataUri,
        ),
      ).rejects.toThrow(/Invalid handle/)
    })

    test('check if a character exists', async () => {
      const randAccount = privateKeyToAccount(generatePrivateKey())
      const randAddr = randAccount.address
      const randHandle = genRandomHandle()

      // not exists if not created
      const { data: exists } =
        await contract.character.existsCharacterForAddress(randAddr)
      expect(exists).toBe(false)
      const { data: exists2 } =
        await contract.character.existsCharacterForHandle(randHandle)
      expect(exists2).toBe(false)

      // create one
      const characterId = await contract.character
        .createCharacter(randAddr, randHandle, metadataUri)
        .then(({ data }) => data)

      expect(characterId).not.toBeNull()

      // should exist now
      const { data: exists3 } =
        await contract.character.existsCharacterForAddress(randAddr)
      expect(exists3).toBe(true)
      const { data: exists4 } =
        await contract.character.existsCharacterForHandle(randHandle)
      expect(exists4).toBe(true)
    })

    test('createCharacter and getCharacterByTransaction', async () => {
      const result = await contract.character.createCharacter(
        mockUser.address,
        randomHandle,
        metadataUri,
      )
      characterId = result.data
      expect(result.data).not.toBeNull()

      const character = await contract.character.getCharacterByTransaction(
        result.transactionHash,
      )
      expect(character.data.characterId).toBe(characterId)
    })

    test.concurrent('getCharacter', async () => {
      const { data } = await contract.character.getCharacter(characterId!)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getCharacterByHandle', async () => {
      const { data } = await contract.character.getCharacterByHandle(
        randomHandle,
      )
      // expect(data.characterId).toBe(characterId)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getHandle', async () => {
      const { data } = await contract.character.getHandle(characterId!)
      expect(data).toBe(randomHandle)
    })

    test.concurrent('getCharacterMetadataUri', async () => {
      const { data } = await contract.character.getCharacterUri(characterId!)
      expect(data).toBe(metadataUri)
    })
  })

  describe('change a character and check', () => {
    test('setPrimaryCharacter', async () => {
      await contract.character.setPrimaryCharacterId(characterId!)
    })

    test('getPrimaryCharacter', async () => {
      const { data } = await contract.character.getPrimaryCharacterId(
        mockUser.address,
      )
      expect(data).toBe(characterId)
    })

    test('isPrimaryCharacterId', async () => {
      const { data } = await contract.character.isPrimaryCharacterId(
        characterId!,
      )
      expect(data).toBe(true)
    })

    test('setHandle', async () => {
      await contract.character.setHandle(characterId!, randomHandle2)
    })

    test('getHandle - after changed', async () => {
      const { data } = await contract.character.getHandle(characterId!)
      expect(data).toBe(randomHandle2)
    })

    test('setMetadataUri', async () => {
      await contract.character.setCharacterUri(characterId!, metadataUri2)
    })

    test('getMetadataUri', async () => {
      const { data } = await contract.character.getCharacterUri(characterId!)
      expect(data).toBe(metadataUri2)
    })
  })

  describe('change character metadata and check', () => {
    test('setCharacterMetadata', async () => {
      await contract.character.setCharacterMetadata(characterId!, {
        name: 'test-name',
        bio: 'test-bio',
      })

      const { data } = await contract.character.getCharacter(characterId!)

      expect(data.metadata?.name).toBe('test-name')
      expect(data.metadata?.bio).toBe('test-bio')
    })

    test('changeCharacterMetadata', async () => {
      await contract.character.changeCharacterMetadata(
        characterId!,
        (metadata) => {
          metadata = {
            ...metadata,
            name: 'test-name-2',
          }
          return metadata
        },
      )
      const { data } = await contract.character.getCharacter(characterId!)

      expect(data.metadata?.name).toBe('test-name-2')
      expect(data.metadata?.bio).toBe('test-bio')
    })
  })
})
