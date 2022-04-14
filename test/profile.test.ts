import { expect, describe, test } from 'vitest'
import { Contract } from '../src'
import {
  mockUser,
  randomHandle,
  randomHandle2,
  metadataUri,
  metadataUri2,
} from './mock'

const contract = new Contract(mockUser.privateKey)

let profileId: string | null = null

describe('create a profile and check', () => {
  test('createProfile', async () => {
    profileId = await contract
      .createProfile(mockUser.address, randomHandle, metadataUri)
      .then(({ data }) => data)
    expect(profileId).not.toBeNull()
  })

  test.concurrent('getProfile', async () => {
    const { data } = await contract.getProfile(profileId!)
    expect(data.handle).toBe(randomHandle)
    expect(data.metadataUri).toBe(metadataUri)
  })

  test.concurrent('getProfile', async () => {
    const { data } = await contract.getProfileByHandle(randomHandle)
    // expect(data.profileId).toBe(profileId)
    expect(data.handle).toBe(randomHandle)
    expect(data.metadataUri).toBe(metadataUri)
  })

  test.concurrent('getHandle', async () => {
    const { data } = await contract.getHandle(profileId!)
    expect(data).toBe(randomHandle)
  })

  test.concurrent('getProfileMetadataUri', async () => {
    const { data } = await contract.getProfileMetadataUri(profileId!)
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

  test('setHandle', async () => {
    await contract.setHandle(profileId!, randomHandle2)
  })

  test('getHandle - after changed', async () => {
    const { data } = await contract.getHandle(profileId!)
    expect(data).toBe(randomHandle2)
  })

  test('setMetadataUri', async () => {
    await contract.setProfileMetadataUri(profileId!, metadataUri2)
  })

  test('getMetadataUri', async () => {
    const { data } = await contract.getProfileMetadataUri(profileId!)
    expect(data).toBe(metadataUri2)
  })
})
