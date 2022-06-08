import { expect, describe, test } from 'vitest'
import { Indexer } from '../../src'
import { mockUser } from '../mock'

const indexer = new Indexer()

describe.concurrent('profiles', () => {
  test.concurrent('getProfiles', async () => {
    const res = await indexer.getProfiles(mockUser.address)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getPrimaryProfiles', async () => {
    const res = await indexer.getPrimaryProfile(mockUser.address)
    expect(res?.handle).toBeDefined()
  })
})

describe.concurrent('links', () => {
  test.concurrent('getLinklists', async () => {
    const res = await indexer.getLinklistsByAddress(mockUser.address)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getLinkingItems', async () => {
    const res = await indexer.getLinks('10', {
      linkType: 'follow',
      linkItemType: 'Profile',
    })
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getBacklinkingItems', async () => {
    const res = await indexer.getBacklinksOfProfile('10', {
      linkType: 'follow',
    })

    expect(res.list).toBeInstanceOf(Array)
  })
})

// TODO: more apis
