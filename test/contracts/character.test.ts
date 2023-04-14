import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import {
  genRandomHandle,
  metadataUri,
  metadataUri2,
  mockUser,
  randomHandle,
  randomHandle2,
} from '../mock'

const contract = new Contract(mockUser.privateKey)

let characterId: bigint | null = null

describe('character', () => {
  describe('create a character and check', () => {
    test('should fail to createCharacter if the handle is not in correct format', () => {
      expect(
        contract.character.create(
          mockUser.address,
          'cannot contain whitespace',
          metadataUri,
        ),
      ).rejects.toThrow(/Invalid handle/)

      expect(
        contract.character.create(
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
      const { data: exists } = await contract.character.existsForAddress(
        randAddr,
      )
      expect(exists).toBe(false)
      const { data: exists2 } = await contract.character.existsForHandle(
        randHandle,
      )
      expect(exists2).toBe(false)

      // create one
      const characterId = await contract.character
        .create(randAddr, randHandle, metadataUri)
        .then(({ data }) => data)

      expect(characterId).not.toBeNull()

      // should exist now
      const { data: exists3 } = await contract.character.existsForAddress(
        randAddr,
      )
      expect(exists3).toBe(true)
      const { data: exists4 } = await contract.character.existsForHandle(
        randHandle,
      )
      expect(exists4).toBe(true)
    })

    test('createCharacter and getCharacterByTransaction', async () => {
      const result = await contract.character.create(
        mockUser.address,
        randomHandle,
        metadataUri,
      )
      characterId = result.data
      expect(result.data).not.toBeNull()

      const character = await contract.character.getByTransaction(
        result.transactionHash,
      )
      expect(character.data.characterId).toBe(characterId)
    })

    test.concurrent('getCharacter', async () => {
      const { data } = await contract.character.get(characterId!)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getCharacterByHandle', async () => {
      const { data } = await contract.character.getByHandle(randomHandle)
      // expect(data.characterId).toBe(characterId)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getHandle', async () => {
      const { data } = await contract.character.getHandle(characterId!)
      expect(data).toBe(randomHandle)
    })

    test.concurrent('getCharacterMetadataUri', async () => {
      const { data } = await contract.character.getUri(characterId!)
      expect(data).toBe(metadataUri)
    })
  })

  describe('change a character and check', () => {
    test('setPrimaryCharacter', async () => {
      await contract.character.setPrimaryId(characterId!)
    })

    test('getPrimaryCharacter', async () => {
      const { data } = await contract.character.getPrimaryId(mockUser.address)
      expect(data).toBe(characterId)
    })

    test('isPrimaryCharacterId', async () => {
      const { data } = await contract.character.isPrimaryId(characterId!)
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
      await contract.character.setUri(characterId!, metadataUri2)
    })

    test('getMetadataUri', async () => {
      const { data } = await contract.character.getUri(characterId!)
      expect(data).toBe(metadataUri2)
    })
  })

  describe('change character metadata and check', () => {
    test('setCharacterMetadata', async () => {
      await contract.character.setMetadata(characterId!, {
        name: 'test-name',
        bio: 'test-bio',
      })

      const { data } = await contract.character.get(characterId!)

      expect(data.metadata?.name).toBe('test-name')
      expect(data.metadata?.bio).toBe('test-bio')
    })

    test('changeCharacterMetadata', async () => {
      await contract.character.changeMetadata(characterId!, (metadata) => {
        metadata = {
          ...metadata,
          name: 'test-name-2',
        }
        return metadata
      })
      const { data } = await contract.character.get(characterId!)

      expect(data.metadata?.name).toBe('test-name-2')
      expect(data.metadata?.bio).toBe('test-bio')
    })
  })
})
