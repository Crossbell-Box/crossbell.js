import { type Address, type Hash } from 'viem'
import { type CharacterEntity } from './character'
import { type NoteEntity } from './note'

export interface MintedNoteEntity {
  noteCharacterId: number
  noteCharacter?: CharacterEntity
  noteId: number
  note?: NoteEntity | null
  contractAddress: Address
  tokenId: number
  operator: Address
  owner: Address
  fromAddress: Address
  createdAt: string
  updatedAt: string
  transactionHash: Hash
  blockNumber: number
  logIndex: number
  updatedTransactionHash: Hash
  updatedBlockNumber: number
  updatedLogIndex: number
}
