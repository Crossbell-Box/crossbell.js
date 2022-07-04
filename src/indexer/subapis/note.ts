import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { ListResponse, NoteEntity } from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'

export class NoteIndexer extends BaseIndexer {
  /**
   * This returns a list of notes.
   *
   * @category Note
   * @param options - The options to send to the indexer.
   * @returns The list of linklist.
   */
  async getNotes({
    characterId,
    linkItemType,
    toCharacterId,
    toAddress,
    toNoteId,
    toContractAddress,
    toTokenId,
    toLinklistId,
    toUri,
    locked,
    includeDeleted,
    limit = 20,
    cursor,
  }: {
    /** The owner of this note */
    characterId?: string
    /** The link item type to filter by. e.g. 'Character' */
    linkItemType?: LinkItemType
    /** The toCharacterId to filter by. */
    toCharacterId?: string
    /** The toAddress to filter by. */
    toAddress?: string
    /** The toNoteId to filter by. */
    toNoteId?: string
    /** The toContractAddress to filter by. */
    toContractAddress?: string
    /** The toTokenId to filter by. */
    toTokenId?: string
    /** The toLinklistId to filter by. */
    toLinklistId?: string
    /** The toUri to filter by. */
    toUri?: string
    /** Only returns locked notes or not */
    locked?: boolean
    /** Also returns deleted notes or not */
    includeDeleted?: boolean
    /** Limit the count of items returned. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}): Promise<ListResponse<NoteEntity>> {
    let url = `${this.endpoint}/notes?`
    url += queryString.stringify({
      profileId,
      limit,
      cursor,
      linkItemType,
      toCharacterId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
      locked,
      includeDeleted,
      characterId,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<NoteEntity>
  }

  /**
   * This returns a specific note.
   *
   * @category Note
   * @param characterId - The characterId of the notes owner.
   * @param noteId - The noteId of the note to get.
   * @returns The note.
   */
  async getNote(
    characterId: string,
    noteId: string,
  ): Promise<NoteEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}/notes/${noteId}`
    const res = await fetch(url).then((res) => res.json())

    return res as NoteEntity
  }
}
