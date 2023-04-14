import { type Address } from 'viem'
import { createSearchParamsString } from '../../utils'
import { type NoteMetadata } from '../../types'
import { type ListResponse, type NoteEntity } from '../../types/indexer'
import { type LinkItemType } from '../../types/contract'
import { BaseIndexer } from './base'

export type NoteQueryOptions = {
  /** The owner of this note */
  characterId?: bigint
  /** The link item type to filter by. e.g. 'Character' */
  linkItemType?: LinkItemType
  /** The toCharacterId to filter by. */
  toCharacterId?: bigint
  /** The toAddress to filter by. */
  toAddress?: Address
  /** The toNoteId to filter by. */
  toNoteId?: bigint
  /** The toContractAddress to filter by. */
  toContractAddress?: Address
  /** The toTokenId to filter by. */
  toTokenId?: bigint
  /** The toLinklistId to filter by. */
  toLinklistId?: bigint
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
  /** The `metadata.content.variant` to filter by. */
  variant?: NoteMetadata['variant']
  /** Limit the count of items returned. */
  limit?: number
  /** Used for pagination. */
  cursor?: string
  /** Whether to include notes whose metadata content are empty even though the `tags`, `sources` or `external_urls` fields are specified. */
  includeEmptyMetadata?: boolean
  /** Whether to include the character data in the response. */
  includeCharacter?: boolean
  /** Whether to include the head character data in the response. */
  includeHeadCharacter?: boolean
  /** Whether to include the head note data in the response. */
  includeHeadNote?: boolean
  /** Whether to include nested notes */
  includeNestedNotes?: boolean
  /** How many levels of nested notes to include */
  nestedNotesDepth?: 1 | 2 | 3
  /** How many nested notes to include per note */
  nestedNotesLimit?: number
  /** The order of the returned list. */
  orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount'
}

export class NoteIndexer extends BaseIndexer {
  /**
   * This returns a list of notes.
   *
   * @category Note
   * @param options - The options of note query.
   * @returns The list of notes.
   */
  async getNotes(
    options: NoteQueryOptions = {},
  ): Promise<
    ListResponse<NoteEntity & { fromNotes: ListResponse<NoteEntity> }>
  > {
    let url = `${this.endpoint}/notes?`
    url += createSearchParamsString(options)

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<
      NoteEntity & { fromNotes: ListResponse<NoteEntity> }
    >
  }

  /**
   * This returns a list of notes of a list of characters followed by a character.
   *
   * @category Note
   * @param characterId - The characterId.
   * @param options - The options of note query.
   * @returns
   */
  async getNotesOfCharacterFollowing(
    characterId: bigint,
    options: Omit<NoteQueryOptions, 'characterId'> = {},
  ): Promise<
    ListResponse<NoteEntity & { fromNotes: ListResponse<NoteEntity> }>
  > {
    let url = `${this.endpoint}/characters/${characterId}/notes/following?`
    url += createSearchParamsString(options)

    const res = await this.fetch(url).then((res) => res.json())

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
    characterId: bigint,
    noteId: bigint,
  ): Promise<NoteEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}/notes/${noteId}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as NoteEntity
  }

  /**
   * This returns all distinct tags of notes owned by a character.
   *
   * @category Note
   * @param characterId - The characterId of the notes owner.
   * @param options - The options of note query.
   * @returns The list of tags.
   */
  async getDistinctNoteTagsOfCharacter(
    characterId: bigint,
    {
      sources,
    }: {
      /** The `metadata.content.sources` to filter by. */
      sources?: string | string[]
    } = {},
  ): Promise<ListResponse<string>> {
    let url = `${this.endpoint}/characters/${characterId}/notes/tags?`
    url += createSearchParamsString({
      sources,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<string>
  }

  /**
   * This returns all distinct tags of notes owned by a character.
   *
   * @category Note
   * @param characterId - The characterId of the notes owner.
   * @param options - The options of note query.
   * @returns The list of tags.
   */
  async getDistinctNoteSourcesOfCharacter(
    characterId: bigint,
    {
      tags,
    }: {
      /** The `metadata.content.tags` to filter by. */
      tags?: string | string[]
    } = {},
  ): Promise<ListResponse<string>> {
    let url = `${this.endpoint}/characters/${characterId}/notes/sources?`
    url += createSearchParamsString({
      tags,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<string>
  }
}
