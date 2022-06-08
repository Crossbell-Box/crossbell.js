import { LinkItemType } from './contract'
import { NoteMetadata, ProfileMetadata } from './metadata'

export type ListResponse<T> = {
  cursor: string | null
  count: number
  list: T[]
}

export type MetadataType = 'PROFILE' | 'NOTE' | 'LINKLIST'

export type MetadataEntity<T extends MetadataType> = {
  uri: string
  type: MetadataType | null
  content: T extends 'PROFILE'
    ? ProfileMetadata
    : T extends 'NOTE'
    ? NoteMetadata
    : object
}

export type ProfileEntity = {
  profileId: number
  handle: string
  primary: boolean
  uri: string | null
  metadata?: MetadataEntity<'PROFILE'> | null
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
  fromProfileId: number | null
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
  profileId: number | null
  noteId: number
  linkItemType: LinkItemType | null
  linkKey: string
  toProfileId: number | null
  toProfile?: ProfileEntity | null
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

export type LinkEntity = {
  linklistId: number
  linklist?: LinklistEntity
  linkType: string
  linkItemType: LinkItemType
  linkValue: string
  fromProfileId: number | null
  fromProfile?: ProfileEntity | null
  toProfileId: number | null
  toProfile?: ProfileEntity | null
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
