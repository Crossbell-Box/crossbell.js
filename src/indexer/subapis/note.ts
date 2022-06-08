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
    profileId,
    linkItemType,
    toProfileId,
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
    profileId?: string
    /** The link item type to filter by. e.g. 'Profile' */
    linkItemType?: LinkItemType
    /** The toProfileId to filter by. */
    toProfileId?: string
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
    let url = `${this.endpoint}/profiles/${profileId}/notes?`
    url += queryString.stringify({
      limit,
      cursor,
      linkItemType,
      toProfileId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
      locked,
      includeDeleted,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<NoteEntity>
  }

  /**
   * This returns a specific note.
   *
   * @category Note
   * @param profileId - The profileId of the notes owner.
   * @param noteId - The noteId of the note to get.
   * @returns The note.
   */
  async getNote(profileId: string, noteId: string): Promise<NoteEntity | null> {
    const url = `${this.endpoint}/profiles/${profileId}/notes/${noteId}`
    const res = await fetch(url).then((res) => res.json())

    return res as NoteEntity
  }
}
