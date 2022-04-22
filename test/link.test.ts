import { Wallet } from 'ethers'
import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../src'
import { mockUser, genRandomHandle, metadataUri } from './mock'

const contract = new Contract(mockUser.privateKey)

describe('link profiles and check', () => {
  beforeAll(async () => {
    await contract.connect()
  })

  // create two profiles first
  let profileId1: string | null = null
  let profileId2: string | null = null
  test('create two profiles to link with', async () => {
    profileId1 = await contract
      .createProfile(mockUser.address, genRandomHandle(), metadataUri)
      .then(({ data }) => data)
    profileId2 = await contract
      .createProfile(mockUser.address, genRandomHandle(), metadataUri)
      .then(({ data }) => data)

    expect(profileId1).not.toBeNull()
    expect(profileId2).not.toBeNull()
  })

  const linkType = 'follow'
  let linklistId: string | null = null
  test('linkProfile', async () => {
    linklistId = await contract
      .linkProfile(profileId1!, profileId2!, linkType)
      .then(({ data }) => data)

    expect(linklistId).not.toBeNull()
  })

  test('getLinkingProfileIds', async () => {
    const { data } = await contract.getLinkingProfileIds(profileId1!, linkType)
    expect(data).toContain(profileId2!)
  })

  test('unlinkProfile and check', async () => {
    await contract
      .unlinkProfile(profileId1!, profileId2!, linkType)
      .then(({ data }) => data)

    const { data } = await contract.getLinkingProfileIds(profileId1!, linkType)
    expect(data).not.toContain(profileId2!)
  })

  test('createThenLinkProfile and check', async () => {
    const wallet = Wallet.createRandom()
    const randomAddress = wallet.address

    const { toProfileId, linklistId } = await contract
      .createThenLinkProfile(profileId1!, randomAddress, linkType)
      .then(({ data }) => data)

    expect(toProfileId).not.toBeNull()
    expect(linklistId).not.toBeNull()

    const { data } = await contract.getLinkingProfileIds(profileId1!, linkType)
    expect(data).toContain(toProfileId!)

    const {
      data: { handle },
    } = await contract.getProfileByHandle(randomAddress)
    expect(handle).toBe(randomAddress)
  })
})
