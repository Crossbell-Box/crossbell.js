import { BaseIndexer } from './base'
import type { ListResponse, CharacterEntity } from '../../types/indexer'
import { createSearchParamsString } from '../../utils'
import { Address } from 'abitype'

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
  async getPrimaryCharacter(address: Address): Promise<CharacterEntity | null> {
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
  async getCharacter(
    characterId: bigint,
  ): Promise<CharacterEntity | null> {
    let url = `${this.endpoint}/characters/${characterId}`

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
    let url = `${this.endpoint}/handles/${handle}/character`

    const res = await this.fetch(url).then((res) => res.json())

    return res as CharacterEntity
  }
}
