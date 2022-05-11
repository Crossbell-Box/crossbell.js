import { BaseIndexer } from './base'
import { fetch } from '../fetch'
import type {
  Link,
  LinkFromToDetails,
  LinkFromToType,
  Linklist,
  ListResponse,
  ProfileDetail,
} from '../types'

export class LinkIndexer extends BaseIndexer {
  /** linklists */

  /**
   * This returns a list of linklists owned by a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of linklists.
   */
  async getLinklists(
    address: string,
    {
      limit = 20,
    }: {
      /** Limit the count of items returned. */
      limit?: number
    } = {},
  ) {
    let url = `${this.endpoint}/${address}/linklists?`
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())
    return res as ListResponse<Linklist>
  }

  /** links */

  /**
   * This returns an attached list of linking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param linkTypes - The types of links you want to fetch. e.g. ['follow']
   * @param toTypes - The types of targets you want to fetch. e.g. ['profile']
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getLinkingItems<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(
    address: string,
    linkTypes: string | string[],
    toTypes: LinkFromToType | LinkFromToType[],
    {
      limit = 20,
    }: {
      /** Limit the count of items returned. */
      limit?: number
    } = {},
  ) {
    if (typeof linkTypes === 'string') {
      linkTypes = [linkTypes]
    }

    if (typeof toTypes === 'string') {
      toTypes = [toTypes]
    }

    let url = `${this.endpoint}/${address}/links?`
    const params = new URLSearchParams()
    linkTypes.forEach((t) => params.append('link_types', t))
    toTypes.forEach((t) => params.append('to_types', t))
    params.append('limit', limit.toString())
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<Link<TFromDetail, TToDetail>>
  }

  /**
   * This returns an attached list of backlinking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param linkTypes - The types of links you want to fetch. e.g. ['follow']
   * @param fromTypes - The types of targets you want to fetch. e.g. ['profile']
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getBacklinkingItems<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(
    address: string,
    linkTypes: string | string[],
    fromTypes: LinkFromToType | LinkFromToType[],
    {
      limit = 20,
    }: {
      /** Limit the count of items returned. */
      limit?: number
    } = {},
  ) {
    if (typeof linkTypes === 'string') {
      linkTypes = [linkTypes]
    }

    if (typeof fromTypes === 'string') {
      fromTypes = [fromTypes]
    }

    let url = `${this.endpoint}/${address}/links?`
    const params = new URLSearchParams()
    linkTypes.forEach((t) => params.append('link_types', t))
    fromTypes.forEach((t) => params.append('from_types', t))
    params.append('limit', limit.toString())
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<Link<TFromDetail, TToDetail>>
  }

  /** profile */

  /**
   * This returns an attached list of linking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param linkTypes - The types of links you want to fetch. e.g. ['follow']
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   * @example
   * ```
   * const links = await indexer.getLinkingProfiles('0x...', ['follow'])
   * const profiles = links.list.map((link) => link.to_detail)
   * ```
   */
  async getLinkingProfiles(
    address: string,
    linkTypes: string | string[],
    {
      limit = 20,
    }: {
      /** Limit the count of items returned. */
      limit?: number
    } = {},
  ) {
    return this.getLinkingItems<undefined, ProfileDetail>(
      address,
      linkTypes,
      'profile',
      { limit },
    )
  }

  /**
   * This returns an attached list of backlinking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param linkTypes - The types of links you want to fetch. e.g. ['follow']
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   * @example
   * ```
   * const links = await indexer.getBacklinkingProfiles('0x...', ['follow'])
   * const profiles = links.list.map((link) => link.to_detail)
   * ```
   */
  async getBacklinkingProfiles(
    address: string,
    linkTypes: string | string[],
    {
      limit = 20,
    }: {
      /** Limit the count of items returned. */
      limit?: number
    } = {},
  ) {
    return this.getBacklinkingItems<ProfileDetail, undefined>(
      address,
      linkTypes,
      'profile',
      { limit },
    )
  }
}
