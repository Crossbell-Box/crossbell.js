import { CharacterEntity } from './character'
import { LinkEntity } from './link'
import { LinklistEntity } from './linklist'
import { MintedNoteEntity } from './minted_note'
import { NoteEntity } from './note'

export type FeedType =
  | 'CREATE_CHARACTER'
  | 'UPDATE_CHARACTER_HANDLE'
  | 'UPDATE_CHARACTER_METADATA'
  | 'UPDATE_PRIMARY_CHARACTER'
  | 'TRANSFER_CHARACTER'
  | 'CREATE_LINKLIST'
  | 'UPDATE_LINKLIST'
  | 'TRANSFER_LINKLIST'
  | 'LINK'
  | 'UNLINK'
  | 'POST_NOTE'
  | 'POST_NOTE_FOR_CHARACTER'
  | 'POST_NOTE_FOR_LINKLIST'
  | 'POST_NOTE_FOR_NOTE'
  | 'POST_NOTE_FOR_ERC721'
  | 'POST_NOTE_FOR_ANY_URI'
  | 'POST_NOTE_FOR_ADDRESS'
  | 'UPDATE_NOTE'
  | 'LOCK_NOTE'
  | 'DELETE_NOTE'
  | 'MINT_NOTE'
  | 'TRANSFER_MINTED_NOTE'

export type FeedEntity = {
  type: FeedType
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
