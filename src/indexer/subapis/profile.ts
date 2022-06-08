import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { ListResponse, ProfileEntity } from '../../types/indexer'

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
      cursor,
    }: {
      /** If true, return only the primary profile. */
      primary?: boolean
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<ProfileEntity>> {
    let url = `${this.endpoint}/addresses/${address}/profiles?`
    url += queryString.stringify({ primary, limit, cursor })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<ProfileEntity>
  }

  /**
   * This returns the primary profile owned by a specific address;
   * null if none exists.
   * @category Profile
   * @param address - The address of the profile owner.
   * @returns The primary profile.
   */
  async getPrimaryProfile(address: string): Promise<ProfileEntity | null> {
    return this.getProfiles(address, { limit: 1, primary: true }).then(
      (res) => res.list?.[0] ?? null,
    )
  }

  /**
   * This returns a profile by id; null if none exists.
   * @category Profile
   * @param profileId - The id of the profile.
   * @returns The profile.
   */
  async getProfile(profileId: number): Promise<ProfileEntity | null> {
    let url = `${this.endpoint}/profiles/${profileId}`

    const res = await fetch(url).then((res) => res.json())

    return res as ProfileEntity
  }

  /**
   * This returns a profile by handle; null if none exists.
   * @category Profile
   * @param handle - The handle of the profile.
   * @returns The profile.
   */
  async getProfileByHandle(handle: string): Promise<ProfileEntity | null> {
    let url = `${this.endpoint}/handles/${handle}/profile`

    const res = await fetch(url).then((res) => res.json())

    return res as ProfileEntity
  }
}
