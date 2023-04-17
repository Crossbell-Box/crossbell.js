import {
  type CharacterEntity,
  type LinkItemType,
  type ListResponse,
  type NoteEntity,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class SearchIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This searches for characters on the crossbell contract.
   *
   * @category Search
   * @param query - The query to send to the indexer.
   * @param options - The options to send to the indexer.
   * @returns
   */
  characters(
    query: string,
    options: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
    },
  ) {
    const url = `/characters/search`
    return this.base.fetch<ListResponse<CharacterEntity>>(url, {
      params: { q: query, ...options },
    })
  }

  /**
   * This searches for notes on the crossbell contract.
   *
   * @category Search
   * @param query - The query to send to the indexer.
   * @param options - The options to send to the indexer.
   * @returns
   */
  notes(
    query: string,
    options: {
      /** Notes with the given tags. */
      tags?: string[]
      /** Notes with the given sources. */
      sources?: string[]
      /** The link item type to filter by. e.g. 'Character' */
      linkItemType?: LinkItemType
      /** Note with the given characterId owner */
      characterId?: Numberish
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** Whether to include character metadata */
      includeCharacterMetadata?: boolean
      /** The order of the returned list. */
      orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount'
    },
  ) {
    const url = `/notes/search`
    return this.base.fetch<ListResponse<NoteEntity>>(url, {
      params: {
        q: query,
        ...options,
      },
    })
  }
}
