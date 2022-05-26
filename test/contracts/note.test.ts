import { expect, describe, test, beforeAll } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('should post note', () => {
  let profileId: string
  beforeAll(async () => {
    await contract.connect()

    const { data: pid } = await contract.getPrimaryProfileId(mockUser.address)
    profileId = pid
  })

  test('postNote and check', async () => {
    const { data } = await contract.postNote(profileId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.getNote(profileId, data.noteId)
    expect(note.metadata?.title).toBe('test')
  })

  test('mintNote', async () => {
    const { data } = await contract.postNote(profileId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: mintHash } = await contract.mintNote(
      profileId,
      data.noteId,
      mockUser.address,
    )

    expect(mintHash).toBeDefined()

    // TODO: how do i check the NFT?
  })

  test('deleteNote', async () => {
    const { data } = await contract.postNote(profileId, {
      title: 'test',
      content: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { transactionHash: deleteHash } = await contract.deleteNote(
      profileId,
      data.noteId,
    )

    expect(deleteHash).toBeDefined()

    const { data: note } = await contract.getNote(profileId, data.noteId)
    expect(note.deleted).toBeTruthy()
  })

  test('postNoteForAnyUri', async () => {
    const { data } = await contract.postNoteForAnyUri(
      profileId,
      { title: 'test', content: 'test' },
      'https://example.com',
    )

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.getNote(profileId, data.noteId)
    expect(note.linkKey).toBe(
      contract.getLinkKeyForAnyUri('https://example.com'),
    )
  })
})
