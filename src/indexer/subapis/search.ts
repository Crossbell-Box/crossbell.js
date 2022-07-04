import { BaseIndexer } from './base'
import queryString from 'query-string'
import type {
  ListResponse,
  NoteEntity,
  CharacterEntity,
} from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'

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
    {
      limit = 20,
      cursor,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    },
  ): Promise<ListResponse<CharacterEntity>> {
    let url = `${this.endpoint}/characters/search?`
    url += queryString.stringify({ q: query, limit, cursor })

    const res = await fetch(url).then((res) => res.json())

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
    {
      tags,
      linkItemType,
      characterId,
      limit = 20,
      cursor,
    }: {
      /** Notes with the given tags. */
      tags?: string[]
      /** The link item type to filter by. e.g. 'Character' */
      linkItemType?: LinkItemType
      /** Note with the given characterId owner */
      characterId?: string
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    },
  ): Promise<ListResponse<NoteEntity>> {
    let url = `${this.endpoint}/notes/search?`
    url += queryString.stringify({
      q: query,
      limit,
      cursor,
      tags,
      linkItemType,
      characterId,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<NoteEntity>
  }
}
