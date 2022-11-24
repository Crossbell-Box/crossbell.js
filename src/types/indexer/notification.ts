import { CharacterEntity } from './character'
import { FeedEntity } from './feed'

export type NotificationType =
  | 'OPERATOR_ADDED'
  | 'OPERATOR_REMOVED'
  | 'LINKED'
  | 'UNLINKED'
  | 'NOTE_MINTED'
  | 'NOTE_POSTED'
  | 'MENTIONED'

export type NotificationEntity = {
  characterId: number
  character?: CharacterEntity
  type: NotificationType
  transactionHash: string
  blockNumber: number
  logIndex: number
  feed?: FeedEntity
  createdAt: Date
}
