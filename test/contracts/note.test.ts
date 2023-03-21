import { type BigNumberish } from 'ethers'
import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('should post note', () => {
  let characterId: BigNumberish
  beforeAll(async () => {
    const { data: pid } = await contract.getPrimaryCharacterId(mockUser.address)
    characterId = pid
  })

  test('postNote and check', async () => {
    const { data } = await contract.postNote(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.getNote(characterId, data.noteId)
    expect(note.metadata?.title).toBe('test')
  })

  test('postNotes and check', async () => {
    const { data } = await contract.postNotes([
      {
        characterId,
        metadataOrUri: {
          title: 'test1',
          content: 'test1',
        },
      },
      {
        characterId,
        metadataOrUri: {
          title: 'test2',
          content: 'test2',
        },
      },
    ])

    expect(data.noteIds).toHaveLength(2)

    const { data: note1 } = await contract.getNote(characterId, data.noteIds[0])
    expect(note1.metadata?.title).toBe('test1')

    const { data: note2 } = await contract.getNote(characterId, data.noteIds[1])
    expect(note2.metadata?.title).toBe('test2')
  })

  test('mintNote', async () => {
    const { data } = await contract.postNote(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: mintHash } = await contract.mintNote(
      characterId,
      data.noteId,
      mockUser.address,
    )

    expect(mintHash).toBeDefined()

    // TODO: how do i check the NFT?
  })

  test('deleteNote', async () => {
    const { data } = await contract.postNote(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: deleteHash } = await contract.deleteNote(
      characterId,
      data.noteId,
    )

    expect(deleteHash).toBeDefined()

    const { data: note } = await contract.getNote(characterId, data.noteId)
    expect(note.deleted).toBeTruthy()
  })

  test('postNoteForAnyUri', async () => {
    const { data } = await contract.postNoteForAnyUri(
      characterId,
      { title: 'test', content: 'test' },
      'https://example.com',
    )

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.getNote(characterId, data.noteId)
    expect(note.linkKey).toBe(
      contract.getLinkKeyForAnyUri('https://example.com'),
    )
  })
})
