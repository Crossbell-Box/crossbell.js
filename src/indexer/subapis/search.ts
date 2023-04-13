import { BaseIndexer } from './base'
import type {
  ListResponse,
  NoteEntity,
  CharacterEntity,
} from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'
import { createSearchParamsString } from '../../utils'

export class SearchIndexer extends BaseIndexer {
  /**
   * This searches for characters on the crossbell contract.
   *
   * @category Search
   * @param query - The query to send to the indexer.
   * @param options - The options to send to the indexer.
   * @returns
   */
  async searchCharacters(
    query: string,
    options: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    },
  ): Promise<ListResponse<CharacterEntity>> {
    let url = `${this.endpoint}/characters/search?`
    url += createSearchParamsString({ q: query, ...options })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<CharacterEntity>
  }

  /**
   * This searches for notes on the crossbell contract.
   *
   * @category Search
   * @param query - The query to send to the indexer.
   * @param options - The options to send to the indexer.
   * @returns
   */
  async searchNotes(
    query: string,
    options: {
      /** Notes with the given tags. */
      tags?: string[]
      /** Notes with the given sources. */
      sources?: string[]
      /** The link item type to filter by. e.g. 'Character' */
      linkItemType?: LinkItemType
      /** Note with the given characterId owner */
      characterId?: bigint
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** Whether to include character metadata */
      includeCharacterMetadata?: boolean
      /** The order of the returned list. */
      orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount'
    },
  ): Promise<ListResponse<NoteEntity>> {
    let url = `${this.endpoint}/notes/search?`
    url += createSearchParamsString({
      q: query,
      ...options,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<NoteEntity>
  }
}
