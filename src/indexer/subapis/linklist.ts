import {
  type LinklistEntity,
  type ListResponse,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class LinklistIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of linklists of a specific character.
   * @category Linklist
   * @param characterId - The characterId of the linklists owner.
   * @param options - The options to send to the indexer.
   * @returns The list of linklist.
   */
  getManyByCharacter(
    characterId: Numberish,
    {
      linkType,
      limit = 20,
      cursor,
    }: {
      /** The link type to filter by. */
      linkType?: string
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ) {
    const url = `/characters/${characterId}/linklists`
    return this.base.fetch<ListResponse<LinklistEntity>>(url, {
      params: {
        linkType,
        limit,
        cursor,
      },
    })
  }

  /**
   * This returns a linklist by id; null if none exists.
   * @category Linklist
   * @param linklistId - The id of the linklist.
   * @returns The character.
   */
  get(linklistId: Numberish) {
    const url = `/linklists/${linklistId}`
    return this.base.fetch<LinklistEntity | null>(url)
  }
}
