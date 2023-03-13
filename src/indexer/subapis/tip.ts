import { BaseIndexer } from './base'
import type { ListResponse, TipEntity } from '../../types/indexer'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils/query_string'

export class TipIndexer extends BaseIndexer {
  /**
   * This returns a list of tips.
   *
   * @category Tip
   * @param characterId - The characterId of the feed owner.
   * @param options - The options to send to the indexer.
   * @returns The list of tips.
   */
  async getTips({
    characterId,
    toCharacterId,
    toNoteId,
    tokenAddress,
    limit,
    cursor,
  }: {
    /** The characterId of the tip sender. */
    characterId?: BigNumberish
    /** The characterId of the tip receiver. */
    toCharacterId?: BigNumberish
    /** The noteId of the tip receiver. */
    toNoteId?: BigNumberish
    /** The token address of the token sent in tip. */
    tokenAddress?: string
    /** Limit the count of items returned. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}): Promise<ListResponse<TipEntity>> {
    let url = `${this.endpoint}/tips?`
    url += createSearchParamsString({
      characterId,
      toCharacterId,
      toNoteId,
      tokenAddress,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<TipEntity>
  }

  /**
   * This returns a specific tip.
   *
   * @category Tip
   * @param transactionHash - The transactionHash of the tip.
   * @param logIndex - The logIndex of the tip.
   * @returns The tip.
   */
  async getTip(
    transactionHash: string,
    logIndex: BigNumberish,
  ): Promise<TipEntity | null> {
    const url = `${this.endpoint}/tips/${transactionHash}/${logIndex}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as TipEntity
  }
}
