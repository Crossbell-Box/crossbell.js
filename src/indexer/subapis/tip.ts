import { BaseIndexer } from './base'
import type { ListResponse, TipEntity } from '../../types/indexer'
import { createSearchParamsString } from '../../utils'
import { Address } from 'abitype'

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
    includeZeroAmount,
    includeMetadata,
    limit,
    cursor,
  }: {
    /** The characterId of the tip sender. */
    characterId?: bigint
    /** The characterId of the tip receiver. */
    toCharacterId?: bigint
    /** The noteId of the tip receiver. */
    toNoteId?: bigint
    /** The token address of the token sent in tip. */
    tokenAddress?: Address
    /** Whether to include tips with zero amount. */
    includeZeroAmount?: boolean
    /** Whether to include character and note metadata */
    includeMetadata?: boolean
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
      includeZeroAmount,
      includeMetadata,
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
    logIndex: bigint,
  ): Promise<TipEntity | null> {
    const url = `${this.endpoint}/tips/${transactionHash}/${logIndex}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as TipEntity
  }
}
