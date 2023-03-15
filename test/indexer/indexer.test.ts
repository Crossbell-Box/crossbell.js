import { expect, describe, test } from 'vitest'
import { Indexer } from '../../src'
import { mockUser } from '../mock'

const indexer = new Indexer()

describe.concurrent('characters', () => {
  test.concurrent('getCharacters', async () => {
    const res = await indexer.getCharacters(mockUser.address)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getPrimaryCharacters', async () => {
    const res = await indexer.getPrimaryCharacter(mockUser.address)
    expect(res?.handle).toBeDefined()
  })
})

describe.concurrent('links', () => {
  test.concurrent('getLinklists', async () => {
    const res = await indexer.getLinklistsOfCharacter(10)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getLinkingItems', async () => {
    const res = await indexer.getLinks('10', {
      linkType: 'follow',
      linkItemType: 'Character',
    })
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getBacklinkingItems', async () => {
    const res = await indexer.getBacklinksOfCharacter('10', {
      linkType: 'follow',
    })

    expect(res.list).toBeInstanceOf(Array)
  })
})

// TODO: more apis
