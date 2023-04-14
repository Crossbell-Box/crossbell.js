import { type Address } from 'viem'
import { type NoteMetadata } from '../../types'
import { type ListResponse, type MintedNoteEntity } from '../../types/indexer'
import { type BaseIndexer } from './base'

export class MintedNoteIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of minted notes.
   *
   * @category MintedNote
   * @param address - The owner of the minted notes.
   * @param options - The options to send to the indexer.
   * @returns The list of minted notes.
   */
  getManyByAddress(
    address: Address,
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
  ) {
    const url = `/addresses/${address}/minted/notes`
    return this.base.fetch<ListResponse<MintedNoteEntity>>(url, {
      params: {
        noteCharacterId,
        noteId,
        variant,
        limit,
        cursor,
        order,
      },
    })
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
  getManyByNote(
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
  ) {
    const url = `/notes/${characterId}/${noteId}/minted`
    return this.base.fetch<ListResponse<MintedNoteEntity>>(url, {
      params: {
        owner,
        limit,
        cursor,
        order,
      },
    })
  }

  /**
   * This returns a specific minted note.
   *
   * @category MintedNote
   * @param contractAddress - The contractAddress of the minted note.
   * @param tokenId - The tokenId of the minted note.
   * @returns The minted note.
   */
  get(contractAddress: Address, tokenId: bigint) {
    const url = `/minted/notes/${contractAddress}/${tokenId}`
    return this.base.fetch<MintedNoteEntity | null>(url)
  }
}
