import { BaseIndexer } from './base'
import type { LinklistEntity, ListResponse } from '../../types/indexer'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils/query_string'

export class LinklistIndexer extends BaseIndexer {
  /**
   * This returns a list of linklists owned by a specific address.
   * @category Linklist
   * @param address - The address of the linklists owner.
   * @param options - The options to send to the indexer.
   * @returns The list of linklist.
   */
  async getLinklistsByAddress(
    address: string,
    {
      attached = false,
      linkType,
      limit = 20,
      cursor,
    }: {
      /** If true, return only the attached linklists. */
      attached?: boolean
      /** The link type to filter by. */
      linkType?: string
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<LinklistEntity>> {
    let url = `${this.endpoint}/addresses/${address}/linklists?`
    url += createSearchParamsString({ attached, linkType, limit, cursor })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinklistEntity>
  }

  /**
   * This returns a list of linklists attached to a specific character.
   * @category Linklist
   * @param characterId - The characterId of the linklists owner.
   * @param options - The options to send to the indexer.
   * @returns The list of linklist.
   */
  async getLinklistsByCharacter(
    characterId: BigNumberish,
    {
      attached = false,
      linkType,
      limit = 20,
      cursor,
    }: {
      /** If true, return only the attached linklists. */
      attached?: boolean
      /** The link type to filter by. */
      linkType?: string
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<LinklistEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/linklists?`
    url += createSearchParamsString({ attached, linkType, limit, cursor })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinklistEntity>
  }

  /**
   * This returns a linklist by id; null if none exists.
   * @category Linklist
   * @param linklistId - The id of the linklist.
   * @returns The character.
   */
  async getLinklist(linklistId: BigNumberish): Promise<LinklistEntity | null> {
    let url = `${this.endpoint}/linklists/${linklistId}`

    const res = await this.fetch(url).then((res) => res.json())

    return res as LinklistEntity
  }
}
