import { describe, expect, test } from 'vitest'
import { createIndexer } from '../../src'
import { mockUser } from '../mock'

const indexer = createIndexer()

describe('newbie', () => {
  test('sign in', async () => {
    const token = await indexer.newbie.signIn(mockUser.email, mockUser.password)
    expect(token).toBeTruthy()
    expect(token).toEqual(indexer.newbie.token)
  })

  test('current user', async () => {
    const account = await indexer.newbie.getAccount()
    expect(account.email).toEqual(mockUser.email)
    expect(account.characterId).to.be.a('number')
  })
})
