import { BaseIndexer } from './base'
import type {
  GetLinkingItemsOptions,
  Link,
  LinkFromToDetails,
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
    let url = `${this.endpoint}/addresses/${address}/linklists?`
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())
    return res as ListResponse<Linklist>
  }

  /** links */

  private async _getLinkingOrBacklinkingItems<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(
    scope: 'addresses' | 'profiles',
    linkDirection: 'links' | 'backlinks',
    id: string,
    {
      linkTypes = [],
      fromTypes = [],
      toTypes = [],
      from = [],
      to = [],
      limit = 20,
      attached = true,
    }: GetLinkingItemsOptions = {},
  ) {
    if (typeof linkTypes === 'string') {
      linkTypes = [linkTypes]
    }

    if (typeof fromTypes === 'string') {
      fromTypes = [fromTypes]
    }

    if (typeof toTypes === 'string') {
      toTypes = [toTypes]
    }

    if (typeof from === 'string') {
      from = [from]
    }

    if (typeof to === 'string') {
      to = [to]
    }

    let url = `${this.endpoint}/${scope}/${id}/${linkDirection}?`
    const params = new URLSearchParams()
    linkTypes.forEach((x) => params.append('link_types', x))
    fromTypes.forEach((x) => params.append('from_types', x))
    toTypes.forEach((x) => params.append('to_types', x))
    from.forEach((x) => params.append('from', x))
    to.forEach((x) => params.append('to', x))
    params.append('limit', limit.toString())
    params.append('attached', attached.toString())
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<Link<TFromDetail, TToDetail>>
  }

  /**
   * This returns a list of linking targets of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getLinkingItems<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(address: string, options: GetLinkingItemsOptions) {
    const res = await this._getLinkingOrBacklinkingItems<
      TFromDetail,
      TToDetail
    >('addresses', 'links', address, options)

    return res
  }

  /**
   * This returns an attached list of backlinking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getBacklinkingItems<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(address: string, options: GetLinkingItemsOptions) {
    const res = await this._getLinkingOrBacklinkingItems<
      TFromDetail,
      TToDetail
    >('addresses', 'backlinks', address, options)

    return res
  }

  /**
   * This returns a list of linking targets of a specific profile.
   * @category Link
   * @param profileId - The id of the profile.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getLinkingItemsByProfileId<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(profileId: string, options: GetLinkingItemsOptions) {
    const res = await this._getLinkingOrBacklinkingItems<
      TFromDetail,
      TToDetail
    >('profiles', 'links', profileId, options)

    return res
  }

  /**
   * This returns a list of backlinking targets of a specific profile.
   * @category Link
   * @param profileId - The id of the profile.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getBacklinkingItemsByProfileId<
    TFromDetail extends LinkFromToDetails = LinkFromToDetails,
    TToDetail extends LinkFromToDetails = LinkFromToDetails,
  >(profileId: string, options: GetLinkingItemsOptions) {
    const res = await this._getLinkingOrBacklinkingItems<
      TFromDetail,
      TToDetail
    >('profiles', 'backlinks', profileId, options)

    return res
  }

  /** profile */

  /**
   * This returns a list of linking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   *
   * @example Get all followings of a address('s primary profile)
   * ```
   * const links = await indexer.getLinkingProfiles('0x...', { linkTypes: ['follow'] })
   * const profiles = links.list.map((link) => link.to_detail)
   * ```
   */
  async getLinkingProfiles(address: string, options: GetLinkingItemsOptions) {
    const res = await this._getLinkingOrBacklinkingItems<
      undefined,
      ProfileDetail
    >('addresses', 'links', address, options)

    return res
  }

  /**
   * This returns a list of backlinking target of a specific address.
   * @category Link
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   *
   * @example Get all followers of an address('s primary profile)
   * ```
   * const links = await indexer.getBacklinkingProfiles('0x...', { linkTypes: ['follow'] })
   * const profiles = links.list.map((link) => link.from_detail)
   * ```
   */
  async getBacklinkingProfiles(
    address: string,
    options: GetLinkingItemsOptions,
  ) {
    const res = await this._getLinkingOrBacklinkingItems<
      ProfileDetail,
      undefined
    >('addresses', 'backlinks', address, options)

    return res
  }

  /**
   * This returns a list of linking target of a specific profile.
   * @category Link
   * @param profileId - The id of the profile.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   *
   * @example Get all followings of a profile
   * ```
   * const links = await indexer.getLinkingProfilesByProfileId('42', { linkTypes: ['follow'] })
   * const profiles = links.list.map((link) => link.to_detail)
   * ```
   */
  async getLinkingProfilesByProfileId(
    profileId: string,
    options: GetLinkingItemsOptions,
  ) {
    const res = await this._getLinkingOrBacklinkingItems<
      undefined,
      ProfileDetail
    >('profiles', 'links', profileId, options)

    return res
  }

  /**
   * This returns a list of backlinking target of a specific profile.
   * @category Link
   * @param profileId - The id of the profile.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   *
   * @example Get all followings of a profile
   * ```
   * const links = await indexer.getBacklinkingProfilesByProfileId('42', { linkTypes: ['follow'] })
   * const profiles = links.list.map((link) => link.from_detail)
   * ```
   */
  async getBacklinkingProfilesByProfileId(
    profileId: string,
    options: GetLinkingItemsOptions,
  ) {
    const res = await this._getLinkingOrBacklinkingItems<
      ProfileDetail,
      undefined
    >('profiles', 'backlinks', profileId, options)

    return res
  }
}
