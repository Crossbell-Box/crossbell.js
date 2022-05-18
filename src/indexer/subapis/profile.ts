import { BaseIndexer } from './base'
import type { ListResponse, ProfileDetail } from '../../types/indexer'

export class ProfileIndexer extends BaseIndexer {
  /**
   * This returns a list of profiles owned by a specific address.
   * @category Profile
   * @param address - The address of the profile owner.
   * @param options - The options to send to the indexer.
   * @returns The list of profiles.
   */
  async getProfiles(
    address: string,
    {
      primary = false,
      limit = 20,
      lastIdentifier,
    }: {
      /** If true, return only the primary profile. */
      primary?: boolean
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      lastIdentifier?: string
    } = {},
  ) {
    let url = `${this.endpoint}/addresses/${address}/profiles?`
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (typeof lastIdentifier !== 'undefined') {
      params.append('last_identifier', lastIdentifier)
    }
    if (primary) {
      params.append('primary', 'true')
    }
    url += params.toString()

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<ProfileDetail>
  }

  /**
   * This returns the primary profile owned by a specific address;
   * null if none exists.
   * @category Profile
   * @param address - The address of the profile owner.
   * @returns The primary profile.
   */
  async getPrimaryProfile(address: string): Promise<ProfileDetail | null> {
    return this.getProfiles(address, { limit: 1, primary: true }).then(
      (res) => res.list?.[0] ?? null,
    )
  }
}
