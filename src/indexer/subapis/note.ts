import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { ListResponse, NoteEntity } from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'
import { type BigNumberish } from 'ethers'

export class NoteIndexer extends BaseIndexer {
  /**
   * This returns a list of notes.
   *
   * @category Note
   * @param options - The options to send to the indexer.
   * @returns The list of notes.
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
    tags,
    sources,
    externalUrls,
    limit = 20,
    cursor,
    includeEmptyMetadata,
    includeCharacter,
    includeNestedNotes,
    nestedNotesDepth,
    nestedNotesLimit,
  }: {
    /** The owner of this note */
    characterId?: BigNumberish
    /** The link item type to filter by. e.g. 'Character' */
    linkItemType?: LinkItemType
    /** The toCharacterId to filter by. */
    toCharacterId?: BigNumberish
    /** The toAddress to filter by. */
    toAddress?: string
    /** The toNoteId to filter by. */
    toNoteId?: BigNumberish
    /** The toContractAddress to filter by. */
    toContractAddress?: string
    /** The toTokenId to filter by. */
    toTokenId?: BigNumberish
    /** The toLinklistId to filter by. */
    toLinklistId?: BigNumberish
    /** The toUri to filter by. */
    toUri?: string
    /** Only returns locked notes or not */
    locked?: boolean
    /** Also returns deleted notes or not */
    includeDeleted?: boolean
    /** The `metadata.content.tags` to filter by. */
    tags?: string | string[]
    /** The `metadata.content.sources` to filter by. */
    sources?: string | string[]
    /** The `metadata.content.external_urls` to filter by. */
    externalUrls?: string | string[]
    /** Limit the count of items returned. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
    /** Whether to include notes whose metadata content are empty even though the `tags`, `sources` or `external_urls` fields are specified. */
    includeEmptyMetadata?: boolean
    /** Whether to include the character data in the response. */
    includeCharacter?: boolean
    /** Whether to include nested notes */
    includeNestedNotes?: boolean
    /** How many levels of nested notes to include */
    nestedNotesDepth?: 1 | 2 | 3
    /** How many nested notes to include per note */
    nestedNotesLimit?: number
  } = {}): Promise<
    ListResponse<NoteEntity & { fromNotes: ListResponse<NoteEntity> }>
  > {
    let url = `${this.endpoint}/notes?`
    url += queryString.stringify({
      characterId,
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
      tags,
      sources,
      externalUrls,
      includeEmptyMetadata,
      includeCharacter,
      includeNestedNotes,
      nestedNotesDepth,
      nestedNotesLimit,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<
      NoteEntity & { fromNotes: ListResponse<NoteEntity> }
    >
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
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<NoteEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}/notes/${noteId}`
    const res = await fetch(url).then((res) => res.json())

    return res as NoteEntity
  }

  /**
   * This returns all distinct tags of notes owned by a character.
   *
   * @category Note
   * @param characterId - The characterId of the notes owner.
   * @param options - The options to send to the indexer.
   * @returns The list of tags.
   */
  async getDistinctNoteTagsOfCharacter(
    characterId: BigNumberish,
    {
      sources,
    }: {
      /** The `metadata.content.sources` to filter by. */
      sources?: string | string[]
    } = {},
  ): Promise<ListResponse<string>> {
    let url = `${this.endpoint}/characters/${characterId}/notes/tags?`
    url += queryString.stringify({
      sources,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<string>
  }
}
