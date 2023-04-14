import { describe, expect, test } from 'vitest'
import { Indexer } from '../../src'
import { mockUser } from '../mock'

const indexer = new Indexer()

describe.concurrent('characters', () => {
  test.concurrent('getCharacters', async () => {
    const res = await indexer.character.getMany(mockUser.address)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getPrimaryCharacters', async () => {
    const res = await indexer.character.getPrimary(mockUser.address)
    expect(res?.handle).toBeDefined()
  })
})

describe.concurrent('links', () => {
  test.concurrent('getLinklists', async () => {
    const res = await indexer.linklist.getManyByCharacter(10n)
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getLinkingItems', async () => {
    const res = await indexer.link.getMany(10n, {
      linkType: 'follow',
      linkItemType: 'Character',
    })
    expect(res.list).toBeInstanceOf(Array)
  })

  test.concurrent('getBacklinkingItems', async () => {
    const res = await indexer.linklist.getManyByCharacter(10n, {
      linkType: 'follow',
    })

    expect(res.list).toBeInstanceOf(Array)
  })
})

// TODO: more apis
