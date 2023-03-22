import { BaseIndexer } from './base'
import type {
  ListResponse,
  NotificationEntity,
  NotificationTypeKey,
} from '../../types/indexer'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils'

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
      includeSelfInvoked,
      includeIsRead,
      read,
      limit,
      cursor,
    }: {
      /** The type of notification */
      type?: NotificationTypeKey | NotificationTypeKey[]
      /** Whether to include metadata of the character */
      includeCharacterMetadata?: boolean
      /** Whether to include actions invoked by the character itself */
      includeSelfInvoked?: boolean
      /** Whether to include `isRead` attribute to indicate whether the notification is read */
      includeIsRead?: boolean
      /** @deprecated Whether to read notifications. Please use */
      read?: boolean
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
      includeSelfInvoked,
      includeIsRead,
      read,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<NotificationEntity>
  }

  /**
   * This marks all notifications as read.
   *
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @returns The latest notification date string.
   */
  async markNotificationsAsRead(
    characterId: BigNumberish,
  ): Promise<{ data: string }> {
    const url = `${this.endpoint}/characters/${characterId}/notifications/read`
    const res = await this.fetch(url, {
      method: 'POST',
    }).then((res) => res.json())

    return res as { data: string }
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
