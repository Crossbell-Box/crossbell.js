import { Address } from 'abitype'
import { CharacterEntity } from './character'
import { LinklistEntity } from './linklist'
import { NoteEntity } from './note'

export type LinkModuleTargetItemType =
  | 'Address'
  | 'Character'
  | 'ERC721'
  | 'Linklist'
  | 'Note'

export interface LinkModuleEntity {
  targetItemType: LinkModuleTargetItemType
  linkValue: string
  contractAddress: Address
  initData: string
  returnData: string
  toCharacterId: number | null
  toCharacter?: CharacterEntity | null
  toAddress: Address
  toNoteId: number | null
  toNote?: NoteEntity | null
  toContractAddress: Address | null
  toTokenId: number | null
  toLinklistId: number | null
  toLinklist?: LinklistEntity | null
  operator: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
