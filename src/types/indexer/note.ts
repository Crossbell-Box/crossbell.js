import { type Address } from 'viem'
import { type CharacterEntity } from './character'
import { type LinklistEntity } from './linklist'
import { type MetadataEntity } from './metadata'
import { type LinkItemType } from './../contract'

export interface NoteEntity {
  characterId: number
  noteId: number
  linkItemType: LinkItemType | null
  linkKey: string
  character?: CharacterEntity | null
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toAddress: Address | null
  toNoteId: number | null
  toNote?: NoteEntity | null
  toHeadCharacterId: number | null
  toHeadCharacter?: CharacterEntity | null
  toHeadNoteId: number | null
  toHeadNote?: NoteEntity | null
  toContractAddress: Address | null
  toTokenId: number | null
  toLinklistId: number | null
  toLinklist?: LinklistEntity | null
  toUri: string | null
  deleted: boolean
  locked: boolean
  contractAddress: Address | null
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
