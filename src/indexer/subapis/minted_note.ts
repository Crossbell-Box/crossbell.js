import { BaseIndexer } from './base'
import type { ListResponse, MintedNoteEntity } from '../../types/indexer'
import { createSearchParamsString } from '../../utils'
import { NoteMetadata } from '../../types'

export class MintedNoteIndexer extends BaseIndexer {
  /**
   * This returns a list of minted notes.
   *
   * @category MintedNote
   * @param address - The owner of the minted notes.
   * @param options - The options to send to the indexer.
   * @returns The list of minted notes.
   */
  async getMintedNotesOfAddress(
    address: string,
    {
      noteCharacterId,
      noteId,
      variant,
      limit,
      cursor,
      order,
    }: {
      /** The character ID of the note */
      noteCharacterId?: bigint
      /** THe note id */
      noteId?: bigint
      /** The `metadata.content.variant` to filter by. */
      variant?: NoteMetadata['variant']
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<MintedNoteEntity>> {
    let url = `${this.endpoint}/addresses/${address}/minted/notes?`
    url += createSearchParamsString({
      noteCharacterId,
      noteId,
      variant,
      limit,
      cursor,
      order,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<MintedNoteEntity>
  }

  /**
   * This returns a list of minted notes.
   *
   * @category MintedNote
   * @param characterId - The characterId of the note minted.
   * @param noteId - The noteId of the note minted.
   * @param options - The options to send to the indexer.
   * @returns The list of minted notes.
   */
  async getMintedNotesOfNote(
    characterId: bigint,
    noteId: bigint,
    {
      owner,
      limit,
      cursor,
      order,
    }: {
      /** The address of the owner */
      owner?: string
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<MintedNoteEntity>> {
    let url = `${this.endpoint}/notes/${characterId}/${noteId}/minted?`
    url += createSearchParamsString({
      owner,
      limit,
      cursor,
      order,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<MintedNoteEntity>
  }

  /**
   * This returns a specific minted note.
   *
   * @category MintedNote
   * @param contractAddress - The contractAddress of the minted note.
   * @param tokenId - The tokenId of the minted note.
   * @returns The minted note.
   */
  async getMintedNote(
    contractAddress: string,
    tokenId: bigint,
  ): Promise<MintedNoteEntity | null> {
    const url = `${this.endpoint}/minted/notes/${contractAddress}/${tokenId}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as MintedNoteEntity
  }
}
