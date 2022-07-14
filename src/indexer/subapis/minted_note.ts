import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { ListResponse, MintedNoteEntity } from '../../types/indexer'
import { type BigNumberish } from 'ethers'

export class MintedNoteIndexer extends BaseIndexer {
  /**
   * This returns a list of minted notes.
   *
   * @category MintedNote
   * @param options - The options to send to the indexer.
   * @returns The list of minted notes.
   */
  async getMintedNotes({
    limit,
    cursor,
  }: {
    /** Limit the count of items returned. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}): Promise<ListResponse<MintedNoteEntity>> {
    let url = `${this.endpoint}/minted/notes?`
    url += queryString.stringify({
      limit,
      cursor,
    })

    const res = await fetch(url).then((res) => res.json())

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
    contractAddress: BigNumberish,
    tokenId: BigNumberish,
  ): Promise<MintedNoteEntity | null> {
    const url = `${this.endpoint}/minted/notes/${contractAddress}/${tokenId}`
    const res = await fetch(url).then((res) => res.json())

    return res as MintedNoteEntity
  }
}
