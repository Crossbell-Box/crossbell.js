import { CharacterEntity } from './character'
import { LinkEntity } from './link'
import { LinklistEntity } from './linklist'
import { LinkModuleEntity, LinkModuleTargetItemType } from './link_module'
import { MintedNoteEntity } from './minted_note'
import { MintModuleEntity, MintModuleTargetItemType } from './mint_module'
import { NoteEntity } from './note'
import { TipEntity } from './tip'
import { Address } from 'abitype'

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
  owner: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  transactionHash: string
  blockNumber: number
  logIndex: number
}
