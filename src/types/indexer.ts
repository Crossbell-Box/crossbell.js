import { LinkItemType } from './contract'
import { NoteMetadata, CharacterMetadata } from './metadata'

export type ListResponse<T> = {
  cursor: string | null
  count: number
  list: T[]
}

export type MetadataType = 'CHARACTER' | 'NOTE' | 'LINKLIST'

export type MetadataEntity<T extends MetadataType> = {
  uri: string
  type: MetadataType | null
  content: T extends 'CHARACTER'
    ? CharacterMetadata
    : T extends 'NOTE'
    ? NoteMetadata
    : object
}

export type CharacterEntity = {
  characterId: number
  handle: string
  primary: boolean
  uri: string | null
  metadata?: MetadataEntity<'CHARACTER'> | null
  socialToken: string | null
  operator: string
  owner: string
  fromAddress: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type LinklistEntity = {
  linklistId: number
  attached: boolean
  fromCharacterId: number | null
  linkType: string
  uri: string | null
  metadata?: MetadataEntity<'LINKLIST'> | null
  operator: string
  owner: string
  fromAddress: string
  createdAt: string
  updatedAt: string
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type NoteEntity = {
  characterId: number
  noteId: number
  linkItemType: LinkItemType | null
  linkKey: string
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toAddress: string | null
  toNoteId: number | null
  toNote?: NoteEntity | null
  toContractAddress: string | null
  toTokenId: number | null
  toLinklistId: number | null
  toLinklist?: LinklistEntity | null
  toUri: string | null
  deleted: boolean
  locked: boolean
  contractAddress: string | null
  uri: string | null
  metadata?: MetadataEntity<'NOTE'> | null
  operator: string
  owner: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type MintedNoteEntity = {
  noteCharacterId: number
  noteCharacter?: CharacterEntity
  noteId: number
  note?: NoteEntity | null
  contractAddress: string
  tokenId: number
  operator: string
  owner: string
  fromAddress: string
  createdAt: string
  updatedAt: string
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type LinkEntity = {
  linklistId: number
  linklist?: LinklistEntity
  linkType: string
  linkItemType: LinkItemType
  linkValue: string
  fromCharacterId: number | null
  fromCharacter?: CharacterEntity | null
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toAddress: string | null
  toNoteId: number | null
  toNote?: NoteEntity | null
  toContractAddress: string | null
  toTokenId: number | null
  toLinklistId: number | null
  toLinklist?: LinklistEntity | null
  toUri: string | null
  operator: string
  owner: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

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
