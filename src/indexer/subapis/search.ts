import { BaseIndexer } from './base'
import { fetch } from '../fetch'
import type { ListResponse, ProfileDetail } from '../types'

export class SearchIndexer extends BaseIndexer {
  /**
   * This searches for data on the crossbell contract.
   * @category Search
   * @param query - The query to send to the indexer.
   * @param options - The options to send to the indexer.
   * @returns
   */
  async search(
    query: string,
    {
      type,
      limit = 50,
    }: {
      /** The type of the query target. */
      type: 'owner'
      /** Limit the count of items returned. */
      limit?: number
    },
  ) {
    const url = `${this.endpoint}/search?query=${query}&limit=${limit}&type=${type}`

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<ProfileDetail>
  }
}
