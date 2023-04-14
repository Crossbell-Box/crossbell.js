import { type Address } from 'viem'
import { type LinkItemType } from '../contract'
import { type CharacterEntity } from './character'
import { type LinklistEntity } from './linklist'
import { type NoteEntity } from './note'

export interface LinkEntity {
  linklistId: number
  linklist?: LinklistEntity
  linkType: string
  linkItemType: LinkItemType
  linkValue: string
  fromCharacterId: number | null
  fromCharacter?: CharacterEntity | null
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toAddress: Address | null
  toNoteId: number | null
  toNote?: NoteEntity | null
  toContractAddress: Address | null
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
