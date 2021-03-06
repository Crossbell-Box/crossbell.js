import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { FeedEntity, FeedType, ListResponse } from '../../types/indexer'
import { type BigNumberish } from 'ethers'

export class FeedIndexer extends BaseIndexer {
  /**
   * This returns a list of feeds.
   *
   * @category Feed
   * @param characterId - The characterId of the feed owner.
   * @param options - The options to send to the indexer.
   * @returns The list of feeds.
   */
  async getFeedsOfCharacter(
    characterId: BigNumberish,
    {
      type,
      limit,
      cursor,
    }: {
      /** The type of feed */
      type?: FeedType | FeedType[]
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<FeedEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/feed?`
    url += queryString.stringify({
      type,
      limit,
      cursor,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<FeedEntity>
  }

  /**
   * This returns a list of following's feeds.
   *
   * @category Feed
   * @param characterId - The characterId of the feed owner.
   * @param options - The options to send to the indexer.
   * @returns The list of feeds.
   */
  async getFollowingFeedsOfCharacter(
    characterId: BigNumberish,
    {
      type,
      limit,
      cursor,
    }: {
      /** The type of feed */
      type?: FeedType | FeedType[]
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<FeedEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/feed/follow?`
    url += queryString.stringify({
      type,
      limit,
      cursor,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<FeedEntity>
  }

  /**
   * This returns a specific feed.
   *
   * @category Feed
   * @param contractAddress - The contractAddress of the feed.
   * @param tokenId - The tokenId of the feed.
   * @returns The feed.
   */
  async getFeed(
    transactionHash: string,
    logIndex: BigNumberish,
  ): Promise<FeedEntity | null> {
    const url = `${this.endpoint}/feed/${transactionHash}/${logIndex}`
    const res = await fetch(url).then((res) => res.json())

    return res as FeedEntity
  }
}
