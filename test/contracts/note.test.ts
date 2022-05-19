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
      summary: 'test',
    })

    expect(data.noteId).toBeDefined()

    const { data: note } = await contract.getNote(profileId, data.noteId)
    expect(note.metadata?.title).toBe('test')
  })
})
