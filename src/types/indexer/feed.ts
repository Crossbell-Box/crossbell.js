import { CharacterEntity } from './character'
import { LinkEntity } from './link'
import { LinklistEntity } from './linklist'
import { MintedNoteEntity } from './minted_note'
import { NoteEntity } from './note'

export enum FeedType {
  CREATE_CHARACTER = 'CREATE_CHARACTER',
  UPDATE_CHARACTER_HANDLE = 'UPDATE_CHARACTER_HANDLE',
  UPDATE_CHARACTER_METADATA = 'UPDATE_CHARACTER_METADATA',
  UPDATE_PRIMARY_CHARACTER = 'UPDATE_PRIMARY_CHARACTER',
  TRANSFER_CHARACTER = 'TRANSFER_CHARACTER',
  CREATE_LINKLIST = 'CREATE_LINKLIST',
  UPDATE_LINKLIST = 'UPDATE_LINKLIST',
  TRANSFER_LINKLIST = 'TRANSFER_LINKLIST',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
  POST_NOTE = 'POST_NOTE',
  POST_NOTE_FOR_CHARACTER = 'POST_NOTE_FOR_CHARACTER',
  POST_NOTE_FOR_LINKLIST = 'POST_NOTE_FOR_LINKLIST',
  POST_NOTE_FOR_NOTE = 'POST_NOTE_FOR_NOTE',
  POST_NOTE_FOR_ERC721 = 'POST_NOTE_FOR_ERC721',
  POST_NOTE_FOR_ANYURI = 'POST_NOTE_FOR_ANYURI',
  POST_NOTE_FOR_ADDRESS = 'POST_NOTE_FOR_ADDRESS',
  UPDATE_NOTE = 'UPDATE_NOTE',
  LOCK_NOTE = 'LOCK_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  MINT_NOTE = 'MINT_NOTE',
  TRANSFER_MINTED_NOTE = 'TRANSFER_MINTED_NOTE',
}

export type FeedTypeKey = keyof typeof FeedType

export type FeedEntity = {
  type: FeedTypeKey
  character?: CharacterEntity | null
  characterId: number | null
  linklist?: LinklistEntity | null
  linklistId: number | null
  link?: LinkEntity | null
  linkValue: string | null
  note?: NoteEntity | null
  noteId: number | null
  mintedNote?: MintedNoteEntity | null
  contractAddress: string | null
  tokenId: number | null
  owner: string
  createdAt: Date
  updatedAt: Date
  transactionHash: string | null
  blockNumber: number
  logIndex: number
}
