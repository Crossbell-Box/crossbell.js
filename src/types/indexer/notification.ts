import { type Hash } from 'viem'
import { type CharacterEntity } from './character'
import { type FeedEntity } from './feed'

export enum NotificationType {
	OPERATOR_ADDED = 'OPERATOR_ADDED',
	OPERATOR_REMOVED = 'OPERATOR_REMOVED',
	LINKED = 'LINKED',
	UNLINKED = 'UNLINKED',
	NOTE_MINTED = 'NOTE_MINTED',
	NOTE_POSTED = 'NOTE_POSTED',
	MENTIONED = 'MENTIONED',
	TIPPED = 'TIPPED',
}

export type NotificationTypeKey = keyof typeof NotificationType

export interface NotificationEntity {
	characterId: number
	character?: CharacterEntity
	type: NotificationTypeKey
	transactionHash: Hash
	blockNumber: number
	logIndex: number
	feed?: FeedEntity
	createdAt: Date
	isRead?: boolean
}
