import { beforeAll, describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('should post note', () => {
  let characterId: bigint
  beforeAll(async () => {
    const { data: pid } = await contract.character.getPrimaryId(
      mockUser.address,
    )
    characterId = pid
  })

  test('postNote and check', async () => {
    const { data } = await contract.note.post(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.note.get(characterId, data.noteId)
    expect(note.metadata?.title).toBe('test')
  })

  test('postNotes and check', async () => {
    const { data } = await contract.note.postMany([
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

    const { data: note1 } = await contract.note.get(
      characterId,
      data.noteIds[0],
    )
    expect(note1.metadata?.title).toBe('test1')

    const { data: note2 } = await contract.note.get(
      characterId,
      data.noteIds[1],
    )
    expect(note2.metadata?.title).toBe('test2')
  })

  test('mintNote', async () => {
    const { data } = await contract.note.post(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: mintHash } = await contract.note.mint(
      characterId,
      data.noteId,
      mockUser.address,
    )

    expect(mintHash).toBeDefined()

    // TODO: how do i check the NFT?
  })

  test('deleteNote', async () => {
    const { data } = await contract.note.post(characterId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: deleteHash } = await contract.note.delete(
      characterId,
      data.noteId,
    )

    expect(deleteHash).toBeDefined()

    const { data: note } = await contract.note.get(characterId, data.noteId)
    expect(note.deleted).toBeTruthy()
  })

  test('postNoteForAnyUri', async () => {
    const { data } = await contract.note.postForAnyUri(
      characterId,
      { title: 'test', content: 'test' },
      'https://example.com',
    )

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.note.get(characterId, data.noteId)
    expect(note.linkKey).toBe(
      contract.note.getLinkKeyForAnyUri('https://example.com'),
    )
  })
})
