import { test, expect } from 'vitest'
import { contract } from '../src'
import { MOCK_USER } from './mock'

const api = new contract.Web3Entry(MOCK_USER.privateKey)

const genRandomHandle = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let handle = ''
  for (let i = 0; i < 10; i++) {
    handle += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return 'a-random-handle-' + handle
}

test('createProfile', async () => {
  const profileId = await api.createProfile(
    MOCK_USER.address,
    genRandomHandle(),
    'ipfs://QmTMD6sLA7M4iegKDhbdMPBZ4HLi5fjW27w2J16gqc5Cb7/1.json',
  )

  expect(profileId).toBeDefined()
})
