import { type BigNumberish, Wallet } from 'ethers'
import { expect, describe, test } from 'vitest'
import { Contract } from '../../src'
import { mockUser, genRandomHandle, metadataUri } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('link and check', () => {
  // create two characters first
  let characterId1: BigNumberish | null = null
  let characterId2: BigNumberish | null = null
  test('create two characters to link with', async () => {
    characterId1 = await contract
      .createCharacter(mockUser.address, genRandomHandle(), metadataUri)
      .then(({ data }) => data)
    characterId2 = await contract
      .createCharacter(mockUser.address, genRandomHandle(), metadataUri)
      .then(({ data }) => data)

    expect(characterId1).not.toBeNull()
    expect(characterId2).not.toBeNull()
  })

  const linkType = 'follow'
  let linklistId: BigNumberish | null = null
  test('linkCharacter', async () => {
    const result = await contract.linkCharacter(
      characterId1!,
      characterId2!,
      linkType,
    )
    linklistId = result.data
    expect(linklistId).not.toBeNull()

    const linklist = await contract.getLinklistIdByTransaction(
      result.transactionHash,
    )
    expect(linklist.data).toBe(linklistId)
  })

  test('linkCharactersInBatch', async () => {
    const result = await contract.linkCharactersInBatch(
      characterId1!,
      [characterId2!],
      [],
      linkType,
    )

    expect(result.data).toBe(linklistId)
  })

  test('getLinkingCharacterIds', async () => {
    const { data } = await contract.getLinkingCharacterIds(
      characterId1!,
      linkType,
    )
    expect(data).toContain(characterId2!)
  })

  test('unlinkCharacter and check', async () => {
    await contract
      .unlinkCharacter(characterId1!, characterId2!, linkType)
      .then(({ data }) => data)

    const { data } = await contract.getLinkingCharacterIds(
      characterId1!,
      linkType,
    )
    expect(data).not.toContain(characterId2!)
  })

  test('createThenLinkCharacter and check', async () => {
    const wallet = Wallet.createRandom()
    const randomAddress = wallet.address

    const result = await contract.createThenLinkCharacter(
      characterId1!,
      randomAddress,
      linkType,
    )

    expect(result.data.toCharacterId).not.toBeNull()
    expect(linklistId).not.toBeNull()

    const { data } = await contract.getLinkingCharacterIds(
      characterId1!,
      linkType,
    )
    expect(data).toContain(result.data.toCharacterId!)

    const {
      data: { handle },
    } = await contract.getCharacterByHandle(randomAddress)
    expect(handle).toBe(randomAddress.toLowerCase())

    // should also able to get character by transaction
    const { data: character } = await contract.getCharacterByTransaction(
      result.transactionHash,
    )
    expect(character.characterId).toBe(result.data.toCharacterId)
  })

  // link note
  test('create a note and link it', async () => {
    const note = await contract.postNote(characterId1!, { content: 'test' })

    // like this note
    const result1 = await contract.linkNote(
      characterId1!,
      characterId1!,
      note.data.noteId,
      'like',
    )
    expect(result1.data).not.toBeNull()

    // unlike this note
    const result2 = await contract.unlinkNote(
      characterId1!,
      characterId1!,
      note.data.noteId,
      'like',
    )
    expect(result2.data).not.toBeNull()
  })
})
