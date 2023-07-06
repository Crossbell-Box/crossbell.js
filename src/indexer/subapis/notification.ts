import { type Hash } from 'viem'
import {
  type ListResponse,
  type NotificationEntity,
  type NotificationTypeKey,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class NotificationIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of notifications.
   *
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @param options - The options to send to the indexer.
   * @returns The list of notifications.
   */
  getMany(
    characterId: Numberish,
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
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
    } = {},
  ) {
    const url = `/characters/${characterId}/notifications`
    return this.base.fetch<ListResponse<NotificationEntity>>(url, {
      params: {
        type,
        includeCharacterMetadata,
        includeSelfInvoked,
        includeIsRead,
        read,
        limit,
        cursor,
      },
    })
  }

  /**
   * This marks all notifications as read.
   *
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @returns The latest notification date string.
   */
  markAllAsRead(characterId: Numberish) {
    const url = `/characters/${characterId}/notifications/read`
    return this.base.fetch<{ data: string }>(url, {
      method: 'POST',
    })
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
  get(
    characterId: Numberish,
    transactionHash: Hash,
    logIndex: Numberish,
    {
      includeCharacterMetadata,
    }: {
      /** Whether to include metadata of the character */
      includeCharacterMetadata?: boolean
    } = {},
  ) {
    const url = `/characters/${characterId}/notifications/${transactionHash}/${logIndex}`
    return this.base.fetch<NotificationEntity | null>(url, {
      params: {
        includeCharacterMetadata,
      },
    })
  }

  /**
   * This returns the count of unread notifications.
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   */
  getUnreadCount(characterId: Numberish) {
    const url = `/characters/${characterId}/notifications/unread/count`
    return this.base.fetch<{ count: number }>(url)
  }

  /**
   * This adds a notification device for the character.
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @param deviceToken - The expo device token.
   */
  addDevice(characterId: Numberish, deviceToken: string) {
    const url = `/characters/${characterId}/notifications/devices/${deviceToken}`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
    })
  }

  /**
   * This removes a notification device for the character.
   * @category Notification
   * @param characterId - The characterId of the notification owner.
   * @param deviceToken - The expo device token.
   */
  removeDevice(characterId: Numberish, deviceToken: string) {
    const url = `/characters/${characterId}/notifications/devices/${deviceToken}`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'DELETE',
    })
  }
}
