import { type Address, type Hash } from 'viem'
import { type CharacterEntity } from './character'
import { type LinkEntity } from './link'
import {
	type LinkModuleEntity,
	type LinkModuleTargetItemType,
} from './link_module'
import { type LinklistEntity } from './linklist'
import {
	type MintModuleEntity,
	type MintModuleTargetItemType,
} from './mint_module'
import { type MintedNoteEntity } from './minted_note'
import { type NoteEntity } from './note'
import { type TipConfigEntity, type TipEntity } from './tip'

export enum FeedType {
	CREATE_CHARACTER = 'CREATE_CHARACTER',
	UPDATE_CHARACTER_HANDLE = 'UPDATE_CHARACTER_HANDLE',
	UPDATE_CHARACTER_METADATA = 'UPDATE_CHARACTER_METADATA',
	UPDATE_PRIMARY_CHARACTER = 'UPDATE_PRIMARY_CHARACTER',
	TRANSFER_CHARACTER = 'TRANSFER_CHARACTER',
	ADD_OPERATOR = 'ADD_OPERATOR',
	REMOVE_OPERATOR = 'REMOVE_OPERATOR',
	CREATE_LINKLIST = 'CREATE_LINKLIST',
	UPDATE_LINKLIST = 'UPDATE_LINKLIST',
	TRANSFER_LINKLIST = 'TRANSFER_LINKLIST',
	LINK = 'LINK',
	UNLINK = 'UNLINK',
	POST_NOTE = 'POST_NOTE',
	POST_NOTE_FOR_NOTE = 'POST_NOTE_FOR_NOTE',
	POST_NOTE_FOR_ANY_URI = 'POST_NOTE_FOR_ANY_URI',
	POST_NOTE_FOR_ADDRESS = 'POST_NOTE_FOR_ADDRESS',
	POST_NOTE_FOR_LINKLIST = 'POST_NOTE_FOR_LINKLIST',
	POST_NOTE_FOR_CHARACTER = 'POST_NOTE_FOR_CHARACTER',
	POST_NOTE_FOR_ERC721 = 'POST_NOTE_FOR_ERC721',
	UPDATE_NOTE = 'UPDATE_NOTE',
	LOCK_NOTE = 'LOCK_NOTE',
	DELETE_NOTE = 'DELETE_NOTE',
	MINT_NOTE = 'MINT_NOTE',
	TRANSFER_MINTED_NOTE = 'TRANSFER_MINTED_NOTE',
	SET_LINK_MODULE = 'SET_LINK_MODULE',
	SET_MINT_MODULE = 'SET_MINT_MODULE',
	TIP_CHARACTER = 'TIP_CHARACTER',
}

export type FeedTypeKey = keyof typeof FeedType

export interface FeedEntity {
	type: FeedType
	character?: CharacterEntity
	characterId?: number
	linklist?: LinklistEntity
	linklistId: number
	link?: LinkEntity
	linkValue?: string
	note?: NoteEntity
	noteId?: number
	mintedNote?: MintedNoteEntity
	contractAddress?: Address
	tokenId?: number
	linkModuleTargetItemType?: LinkModuleTargetItemType
	linkModule?: LinkModuleEntity
	mintModuleTargetItemType?: MintModuleTargetItemType
	mintModule?: MintModuleEntity
	tip?: TipEntity
	tipConfig?: TipConfigEntity
	owner: Address
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	transactionHash: Hash
	blockNumber: number
	logIndex: number
}
