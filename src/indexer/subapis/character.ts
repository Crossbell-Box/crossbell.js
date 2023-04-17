import { type Address } from 'viem'
import {
  type CharacterEntity,
  type ListResponse,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class CharacterIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of characters owned by a specific address.
   * @category Character
   * @param address - The address of the character owner.
   * @param options - The options to send to the indexer.
   * @returns The list of characters.
   */
  getMany(
    address: Address,
    {
      primary = undefined,
      limit = 20,
      cursor,
    }: {
      /** If true, return only the primary character. */
      primary?: boolean
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
    } = {},
  ) {
    const url = `/addresses/${address}/characters`
    return this.base.fetch<ListResponse<CharacterEntity>>(url, {
      params: { primary, limit, cursor },
    })
  }

  /**
   * This returns the primary character owned by a specific address;
   * null if none exists.
   * @category Character
   * @param address - The address of the character owner.
   * @returns The primary character.
   */
  async getPrimary(address: Address): Promise<CharacterEntity | null> {
    const res = await this.getMany(address, { limit: 1, primary: true })
    return res.list?.[0] ?? null
  }

  /**
   * This returns a character by id; null if none exists.
   * @category Character
   * @param characterId - The id of the character.
   * @returns The character.
   */
  get(characterId: Numberish) {
    const url = `/characters/${characterId}`
    return this.base.fetch<CharacterEntity | null>(url)
  }

  /**
   * This returns a character by handle; null if none exists.
   * @category Character
   * @param handle - The handle of the character.
   * @returns The character.
   */
  getByHandle(handle: string) {
    const url = `/handles/${handle}/character`
    return this.base.fetch<CharacterEntity | null>(url)
  }
}
