import { type Address } from 'viem'
import { type CharacterEntity } from './character'
import { type NoteEntity } from './note'

export interface MintedNoteEntity {
  noteCharacterId: number
  noteCharacter?: CharacterEntity
  noteId: number
  note?: NoteEntity | null
  contractAddress: Address
  tokenId: number
  operator: string
  owner: string
  fromAddress: Address
  createdAt: string
  updatedAt: string
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
