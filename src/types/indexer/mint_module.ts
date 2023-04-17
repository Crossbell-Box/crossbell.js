import { type Address, type Hash } from 'viem'
import { type CharacterEntity } from './character'
import { type NoteEntity } from './note'

export type MintModuleTargetItemType = 'Note'

export interface MintModuleEntity {
  targetItemType: MintModuleTargetItemType
  linkValue: string
  contractAddress: Address
  initData: string
  returnData: string
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toNoteId: number | null
  toNote?: NoteEntity | null
  operator: Address
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  transactionHash: Hash
  blockNumber: number
  logIndex: number
  updatedTransactionHash: Hash
  updatedBlockNumber: number
  updatedLogIndex: number
}
