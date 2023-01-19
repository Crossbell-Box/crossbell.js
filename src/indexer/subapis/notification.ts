import { BaseIndexer } from './base'
import type {
  ListResponse,
  NotificationEntity,
  NotificationTypeKey,
} from '../../types/indexer'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils/query_string'

export class NotificationIndexer extends BaseIndexer {
  /**
   * This returns a list of notifications.
   *
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @param options - The options to send to the indexer.
   * @returns The list of notifications.
   */
  async getNotificationsOfCharacter(
    characterId: BigNumberish,
    {
      type,
      includeCharacterMetadata,
      limit,
      cursor,
    }: {
      /** The type of notification */
      type?: NotificationTypeKey | NotificationTypeKey[]
      /** Whether to include metadata of the character */
      includeCharacterMetadata?: boolean
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ): Promise<ListResponse<NotificationEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/notifications?`
    url += createSearchParamsString({
      type,
      includeCharacterMetadata,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<NotificationEntity>
  }

  /**
   * This returns a specific notification.
   *
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @param transactionHash - The transactionHash of the notification.
   * @param logIndex - The logIndex of the notification.
   * @returns The feed.
   */
  async getNotification(
    characterId: BigNumberish,
    transactionHash: string,
    logIndex: BigNumberish,
    {
      includeCharacterMetadata,
    }: {
      /** Whether to include metadata of the character */
      includeCharacterMetadata?: boolean
    } = {},
  ): Promise<NotificationEntity | null> {
    let url = `${this.endpoint}/characters/${characterId}/notifications/${transactionHash}/${logIndex}?`
    url += createSearchParamsString({
      includeCharacterMetadata,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as NotificationEntity
  }
}
