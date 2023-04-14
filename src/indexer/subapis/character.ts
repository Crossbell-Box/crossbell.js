import { type Address } from 'viem'
import { createSearchParamsString } from '../../utils'
import { type CharacterEntity, type ListResponse } from '../../types/indexer'
import { BaseIndexer } from './base'

export class CharacterIndexer extends BaseIndexer {
  /**
   * This returns a list of characters owned by a specific address.
   * @category Character
   * @param address - The address of the character owner.
   * @param options - The options to send to the indexer.
   * @returns The list of characters.
   */
  async getCharacters(
    address: Address,
    {
      primary = undefined,
      limit = 20,
      cursor,
    }: {
      /** If true, return only the primary character. */
      primary?: boolean
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<CharacterEntity>> {
    let url = `${this.endpoint}/addresses/${address}/characters?`
    url += createSearchParamsString({ primary, limit, cursor })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<CharacterEntity>
  }

  /**
   * This returns the primary character owned by a specific address;
   * null if none exists.
   * @category Character
   * @param address - The address of the character owner.
   * @returns The primary character.
   */
  getPrimaryCharacter(address: Address): Promise<CharacterEntity | null> {
    return this.getCharacters(address, { limit: 1, primary: true }).then(
      (res) => res.list?.[0] ?? null,
    )
  }

  /**
   * This returns a character by id; null if none exists.
   * @category Character
   * @param characterId - The id of the character.
   * @returns The character.
   */
  async getCharacter(characterId: bigint): Promise<CharacterEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}`

    const res = await this.fetch(url).then((res) => res.json())

    return res as CharacterEntity
  }

  /**
   * This returns a character by handle; null if none exists.
   * @category Character
   * @param handle - The handle of the character.
   * @returns The character.
   */
  async getCharacterByHandle(handle: string): Promise<CharacterEntity | null> {
    const url = `${this.endpoint}/handles/${handle}/character`

    const res = await this.fetch(url).then((res) => res.json())

    return res as CharacterEntity
  }
}
