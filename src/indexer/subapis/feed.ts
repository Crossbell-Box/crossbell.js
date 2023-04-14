import { createSearchParamsString } from '../../utils'
import {
  type FeedEntity,
  type FeedTypeKey,
  type ListResponse,
  type Numberish,
} from '../../types'
import { BaseIndexer } from './base'

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
    characterId: Numberish,
    {
      type,
      limit,
      cursor,
    }: {
      /** The type of feed */
      type?: FeedTypeKey | FeedTypeKey[]
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<FeedEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/feed?`
    url += createSearchParamsString({
      type,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<FeedEntity>
  }

  /**
   * This returns a list of following's feeds.
   *
   * @deprecated Please use {@link getFeedsOfCharacterFollowing} instead. It has the same functionality but with a better name.
   *
   * @category Feed
   * @param characterId - The characterId of the feed owner.
   * @param options - The options to send to the indexer.
   * @returns The list of feeds.
   */
  getFollowingFeedsOfCharacter(
    characterId: Numberish,
    {
      type,
      limit,
      cursor,
    }: {
      /** The type of feed */
      type?: FeedTypeKey | FeedTypeKey[]
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<FeedEntity>> {
    return this.getFeedsOfCharacterFollowing(characterId, {
      type,
      limit,
      cursor,
    })
  }

  /**
   * This returns a list of following's feeds.
   *
   * @category Feed
   * @param characterId - The characterId of the feed owner.
   * @param options - The options to send to the indexer.
   * @returns The list of feeds.
   */
  async getFeedsOfCharacterFollowing(
    characterId: Numberish,
    {
      type,
      limit,
      cursor,
    }: {
      /** The type of feed */
      type?: FeedTypeKey | FeedTypeKey[]
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<FeedEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/feed/follow?`
    url += createSearchParamsString({
      type,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<FeedEntity>
  }

  /**
   * This returns a specific feed.
   *
   * @category Feed
   * @param transactionHash - The transactionHash of the feed.
   * @param logIndex - The logIndex of the feed.
   * @returns The feed.
   */
  async getFeed(
    transactionHash: string,
    logIndex: Numberish,
  ): Promise<FeedEntity | null> {
    const url = `${this.endpoint}/feed/${transactionHash}/${logIndex}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as FeedEntity
  }
}
