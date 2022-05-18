import { Wallet } from 'ethers'
import { expect, describe, test, beforeAll } from 'vitest'
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

let profileId: string | null = null

describe('should fail if not connected', () => {
  test('should fail to createProfile if not connected', () => {
    expect(
      contract.createProfile(mockUser.address, randomHandle, metadataUri),
    ).rejects.toThrow(/Contract not connected/)
  })
})

describe('profile', () => {
  beforeAll(async () => {
    await contract.connect()
  })

  describe('create a profile and check', () => {
    test('should fail to createProfile if the handle is not in correct format', () => {
      expect(
        contract.createProfile(
          mockUser.address,
          'cannot contain whitespace',
          metadataUri,
        ),
      ).rejects.toThrow(/Invalid handle/)

      expect(
        contract.createProfile(
          mockUser.address,
          'cannot-contain-be-more-than-32-characters-longlonglonglonglonglonglonglonglong',
          metadataUri,
        ),
      ).rejects.toThrow(/Invalid handle/)
    })

    test('check if a profile exists', async () => {
      const wallet = Wallet.createRandom()
      const randomAddress = wallet.address
      const randomHandle = genRandomHandle()

      // not exists if not created
      const { data: exists } = await contract.existsProfileForAddress(
        randomAddress,
      )
      expect(exists).toBe(false)
      const { data: exists2 } = await contract.existsProfileForHandle(
        randomHandle,
      )
      expect(exists2).toBe(false)

      // create one
      const profileId = await contract
        .createProfile(randomAddress, randomHandle, metadataUri)
        .then(({ data }) => data)

      expect(profileId).not.toBeNull()

      // should exist now
      const { data: exists3 } = await contract.existsProfileForAddress(
        randomAddress,
      )
      expect(exists3).toBe(true)
      const { data: exists4 } = await contract.existsProfileForHandle(
        randomHandle,
      )
      expect(exists4).toBe(true)
    })

    test('createProfile and getProfileByTransaction', async () => {
      const result = await contract.createProfile(
        mockUser.address,
        randomHandle,
        metadataUri,
      )
      profileId = result.data
      expect(result.data).not.toBeNull()

      const profile = await contract.getProfileByTransaction(
        result.transactionHash,
      )
      expect(profile.data.profileId).toBe(profileId)
    })

    test.concurrent('getProfile', async () => {
      const { data } = await contract.getProfile(profileId!)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getProfileByHandle', async () => {
      const { data } = await contract.getProfileByHandle(randomHandle)
      // expect(data.profileId).toBe(profileId)
      expect(data.handle).toBe(randomHandle)
      expect(data.uri).toBe(metadataUri)
    })

    test.concurrent('getHandle', async () => {
      const { data } = await contract.getHandle(profileId!)
      expect(data).toBe(randomHandle)
    })

    test.concurrent('getProfileMetadataUri', async () => {
      const { data } = await contract.getProfileUri(profileId!)
      expect(data).toBe(metadataUri)
    })
  })

  describe('change a profile and check', () => {
    test('setPrimaryProfile', async () => {
      await contract.setPrimaryProfileId(profileId!)
    })

    test('getPrimaryProfile', async () => {
      const { data } = await contract.getPrimaryProfileId(mockUser.address)
      expect(data).toBe(profileId)
    })

    test('isPrimaryProfileId', async () => {
      const { data } = await contract.isPrimaryProfileId(profileId!)
      expect(data).toBe(true)
    })

    test('setHandle', async () => {
      await contract.setHandle(profileId!, randomHandle2)
    })

    test('getHandle - after changed', async () => {
      const { data } = await contract.getHandle(profileId!)
      expect(data).toBe(randomHandle2)
    })

    test('setMetadataUri', async () => {
      await contract.setProfileUri(profileId!, metadataUri2)
    })

    test('getMetadataUri', async () => {
      const { data } = await contract.getProfileUri(profileId!)
      expect(data).toBe(metadataUri2)
    })
  })

  describe('change profile metadata and check', () => {
    test('setProfileMetadata', async () => {
      await contract.setProfileMetadata(profileId!, {
        name: 'test-name',
        bio: 'test-bio',
      })

      const { data } = await contract.getProfile(profileId!)

      expect(data.metadata?.name).toBe('test-name')
      expect(data.metadata?.bio).toBe('test-bio')
    })

    test('changeProfileMetadata', async () => {
      await contract.changeProfileMetadata(profileId!, (metadata) => {
        metadata = {
          ...metadata,
          name: 'test-name-2',
        }
        return metadata
      })
      const { data } = await contract.getProfile(profileId!)

      expect(data.metadata?.name).toBe('test-name-2')
      expect(data.metadata?.bio).toBe('test-bio')
    })
  })
})
